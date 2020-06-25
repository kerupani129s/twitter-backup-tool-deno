import { download } from 'https://deno.land/x/download/mod.ts';
import { copy, exists } from 'https://deno.land/std/fs/mod.ts';

import  '../viewer/js/inc/util-media.js';

// 
// 
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

export const downloadJsonp = (targetName, path, jsonp) => {
	const dir = './downloads/' + targetName + '/jsonp/' + path;
	return Deno.writeTextFile(dir, jsonp);
};

// 
// 
// 
export const downloadTweetMedia = async (tweet, targetName) => {

	if ( 'media' in tweet['entities'] ) {
		// メモ: await を使用して直列実行したいため、forEach を使わない
		for (const media of tweet['extended_entities']['media']) {

			const mediaUrl = getMediaUrl(media);
			const file = viewer.getLocalBaseNameOf(mediaUrl);
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
// 
// 
export const downloadProfileImage = async (user, targetName) => {

	const mediaUrl = viewer.getProfileImageUrlOriginal(user['profile_image_url_https']);

	const file = viewer.getLocalBaseNameOf(mediaUrl);
	const dir = './downloads/' + targetName + '/profile_image/';

	if ( ! await exists(dir + file) )
		await download(mediaUrl, { file, dir });

};

// 
// 
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
