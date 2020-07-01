import { download } from 'https://deno.land/x/download/mod.ts';
import { copy, exists } from 'https://deno.land/std/fs/mod.ts';

import { print } from './util-print.js';

import  '../viewer/js/inc/util-media.js';

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

};

// 
const downloadTweetMedia = async (targetName, tweet) => {

	if ( 'media' in tweet['entities'] ) {
		// メモ: await を使用して直列実行したいため、forEach を使わない
		for (const media of tweet['extended_entities']['media']) {

			const mediaUrl = getMediaUrl(media);
			const file = viewer.getLocalMediaFileName(mediaUrl);
			const dir = './downloads/' + targetName + '/media/';

			if ( ! await exists(dir + file) )
				await download(mediaUrl, { file, dir });

		}
	}

};

const getMediaUrl = media => {

	const type = media['type'];

	if ( type === 'photo' ) {
		return viewer.getImageUrlLarge(media['media_url_https']);
	} else if ( type === 'video' || type === 'animated_gif' ) {
		return viewer.getVideoUrlLargeMp4(media);
	}

	return '';

};

// 
const downloadProfileImage = async (targetName, user) => {

	const mediaUrl = viewer.getProfileImageUrlOriginal(user['profile_image_url_https']);

	const file = viewer.getLocalMediaFileName(mediaUrl);
	const dir = './downloads/' + targetName + '/profile_image/';

	if ( ! await exists(dir + file) )
		await download(mediaUrl, { file, dir });

};

// 
export const readLocalJsonp = async (targetName, path) => {

	const pathWithDir = './downloads/' + targetName + '/jsonp/' + path;

	if ( await exists(pathWithDir) ) {
		await import(Deno.cwd() + '/' + pathWithDir);
		return window.data;
	} else {
		return;
	}

};

export const writeLocalJsonp = async (targetName, path, obj, initObj = {}) => {

	const pathWithDir = './downloads/' + targetName + '/jsonp/' + path;

	const jsonp = 'window.data = window.data || {};\n' +
		Object.entries(initObj).map(([key, value]) =>
				'\nwindow.data.' + key + ' = window.data.' + key + ' || ' + JSON.stringify(value, null, 4) + ';\n').join('') +
		Object.entries(obj).map(([key, value]) =>
				'\nwindow.data.' + key + ' = ' + JSON.stringify(value, null, 4) + ';\n').join('');

	return Deno.writeTextFile(pathWithDir, jsonp);

};

// 
export const downloadTweetMedias = async (targetName, tweets) => {

	if ( tweets.length === 0 ) return;

	print('\n');

	// メモ: await を使用して直列実行したいため、forEach を使わない
	for (let i = 0; i < tweets.length; i++) {

		const tweet = tweets[i];

		await downloadProfileImage(targetName, tweet['user']);
		await downloadTweetMedia(targetName, tweet);

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
