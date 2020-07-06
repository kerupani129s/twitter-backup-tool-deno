import { download } from 'https://deno.land/x/download/mod.ts';
import { copy, exists } from 'https://deno.land/std/fs/mod.ts';

import { print } from './util-print.js';
import { getTweetMediaUrlLarge, getProfileImageUrlOriginal, getLocalTweetMediaFileName, getLocalProfileImageFileName } from './util-media.js';

// 
export const initDownloadsDirectory = async targetName => {

	// メモ: Deno.copy() と異なる
	// メモ: ビューワを更新した際も反映させたいため、上書きコピー
	// メモ: まとめてコピーしても同じことができるが、ユーザーやデベロッパーの人為的ミスによる、
	//       既存の他ディレクトリの破壊リスクを小さくするため、子ディレクトリごとにコピーする
	await copy('./viewer/css/', './downloads/' + targetName + '/css/', { overwrite: true });
	await copy('./viewer/html/', './downloads/' + targetName + '/', { overwrite: true });
	await copy('./viewer/js/', './downloads/' + targetName + '/js/', { overwrite: true });

	await Deno.mkdir('./downloads/' + targetName + '/jsonp/', { recursive: true });
	await Deno.mkdir('./downloads/' + targetName + '/profile_image/', { recursive: true });
	await Deno.mkdir('./downloads/' + targetName + '/media/', { recursive: true });
	await Deno.mkdir('./downloads/' + targetName + '/json/', { recursive: true });

};

// 
export const readLocalJsonp = async (targetName, fileName) => {

	const path = './downloads/' + targetName + '/jsonp/' + fileName;

	if ( await exists(path) ) {
		await import(Deno.cwd() + '/' + path);
		return window.data;
	} else {
		return;
	}

};

export const writeLocalJsonp = async (targetName, fileName, obj, initObj = {}) => {

	const path = './downloads/' + targetName + '/jsonp/' + fileName;

	const jsonp = 'window.data = window.data || {};\n' +
		Object.entries(initObj).map(([key, value]) =>
				'\nwindow.data.' + key + ' = window.data.' + key + ' || ' + JSON.stringify(value, null, 4) + ';\n').join('') +
		Object.entries(obj).map(([key, value]) =>
				'\nwindow.data.' + key + ' = ' + JSON.stringify(value, null, 4) + ';\n').join('');

	return Deno.writeTextFile(path, jsonp);

};

// 
export const readLocalJson = async (targetName, fileName) => {

	const path = './downloads/' + targetName + '/json/' + fileName;

	if ( await exists(path) ) {
		return JSON.parse(await Deno.readTextFileSync(path));
	} else {
		return;
	}

};

// 
export const addTweetMediasData = tweets => tweets.forEach(tweet => {

	addProfileImageData(tweet['user']);
	addTweetMediaData(tweet);

	if ( 'retweeted_status' in tweet ) {
		const retweetedStatus = tweet['retweeted_status'];
		addProfileImageData(retweetedStatus['user']);
		addTweetMediaData(retweetedStatus);
	}

});

export const addUserMediasData = users => users.forEach(user => {
	addProfileImageData(user);
});

// 
export const downloadTweetMedias = async (targetName, tweets) => {

	if ( tweets.length === 0 ) return;

	print('\n');

	// メモ: await を使用して直列実行したいため、forEach を使わない
	for (let i = 0; i < tweets.length; i++) {

		const tweet = tweets[i];

		await downloadProfileImage(targetName, tweet['user']);
		await downloadTweetMedia(targetName, tweet);

		if ( 'retweeted_status' in tweet ) {
			const retweetedStatus = tweet['retweeted_status'];
			await downloadProfileImage(targetName, retweetedStatus['user']);
			await downloadTweetMedia(targetName, retweetedStatus);
		}

		print('' + (i + 1) + ' / ' + tweets.length + '\r');

	}

	print('\n');

};

export const downloadUserMedias = async (targetName, users) => {

	if ( users.length === 0 ) return;

	print('\n');

	// メモ: await を使用して直列実行したいため、forEach を使わない
	for (let i = 0; i < users.length; i++) {

		const user = users[i];

		await downloadProfileImage(targetName, user);

		print('' + (i + 1) + ' / ' + users.length + '\r');

	}

	print('\n');

};

// 
const addTweetMediaData = tweet => {

	if ( 'media' in tweet['entities'] ) {
		tweet['extended_entities']['media'].forEach(media => {

			if ( media['_media_url_https_large'] || media['_local_media_file_name'] ) return;

			const mediaUrl = getTweetMediaUrlLarge(media);
			const fileName = getLocalTweetMediaFileName(mediaUrl);

			media['_media_url_https_large'] = mediaUrl;
			media['_local_media_file_name'] = fileName;

		});
	}

};

const addProfileImageData = user => {

	if ( user['_profile_image_url_https_large'] || user['_local_profile_image_file_name'] ) return;

	const mediaUrl = getProfileImageUrlOriginal(user['profile_image_url_https']);
	const fileName = getLocalProfileImageFileName(mediaUrl);

	user['_profile_image_url_https_large'] = mediaUrl;
	user['_local_profile_image_file_name'] = fileName;

};

// 
const downloadTweetMedia = async (targetName, tweet) => {

	if ( 'media' in tweet['entities'] ) {
		// メモ: await を使用して直列実行したいため、forEach を使わない
		for (const media of tweet['extended_entities']['media']) {

			const mediaUrl = media['_media_url_https_large'];
			const fileName = media['_local_media_file_name'];

			const dir = './downloads/' + targetName + '/media/';

			if ( ! await exists(dir + fileName) ) {
				try {
					await download(mediaUrl, { file: fileName, dir });
				} catch {
					console.error('NetworkError: ' + mediaUrl);
				}
			}

		}
	}

};

// 
const downloadProfileImage = async (targetName, user) => {

	const mediaUrl = user['_profile_image_url_https_large'];
	const fileName = user['_local_profile_image_file_name'];

	const dir = './downloads/' + targetName + '/profile_image/';

	// TODO: 安定版では以下のコードを削除
	//       ver.2.0-pre-alpha.1 -> ver.2.0-pre-alpha.2 バージョンアップ用
	const fileNameOld = getLocalTweetMediaFileName(mediaUrl);
	if ( await exists(dir + fileNameOld) )
		await Deno.rename(dir + fileNameOld, dir + fileName);

	// 
	if ( ! await exists(dir + fileName) ) {
		try {
			await download(mediaUrl, { file: fileName, dir });
		} catch {
			console.error('NetworkError: ' + mediaUrl);
		}
	}

};
