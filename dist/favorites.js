import { minus } from 'https://deno.land/x/math@v1.1.0/mod.ts';

import Twitter from './inc/twitter.js';
import Profile from './inc/profile.js';
import { initDownloadsDirectory, downloadTweetMedia, downloadProfileImage, readLocalJsonp, writeLocalJsonp } from './inc/downloader.js';

// 
const [loginName, targetName] = Deno.args;

const profile = new Profile('./downloads/config.json');
const twitter = new Twitter(await profile.get(loginName));

// 
const getRemoteTweets = async () => {

	// メモ: 「いいね」はツイートの投稿日時順に取得されるため、過去のツイートが追加される可能性があるので、
	//       'since_id' は利用しない
	const params = {
		'screen_name': targetName,
		'count': 200,
		'tweet_mode': 'extended'
	};

	// 
	const tweets = [];

	while (true) {

		const result = await twitter.get('favorites/list', params);

		if ( result.length === 0 ) break;

		result.forEach(tweet => {
			tweets.push(tweet);
		});

		// 
		const oldestTweet = tweets[tweets.length - 1];

		params['max_id'] = minus(oldestTweet['id_str'], 1);

	}

	return tweets;

};

const printCountOfTweets = (local, added, removed, remote, merged) => {

	console.log('Count of Previous Saved Tweets: ' + local);
	console.log('Count of Remote Tweets: ' + local + ' + ' + added + ' - ' + removed + ' = ' + remote);
	console.log('Total Count of Tweets: ' + local + ' + ' + added + ' = ' + merged);

};

const downloadTweetMedias = async tweets => {

	// メモ: await を使用して直列実行したいため、forEach を使わない
	for (let i = 0; i < tweets.length; i++) {

		const tweet = tweets[i];

		await downloadProfileImage(tweet['user'], targetName);
		await downloadTweetMedia(tweet, targetName);

		console.log('' + (i + 1) + ' / ' + tweets.length);

	}

};

// メモ: 「いいね」はツイートの投稿日時順に取得されるため、過去のツイートが追加される可能性があるので、
//       過去のツイートの追加・削除を全て確認する
const tweets = await getRemoteTweets();

const data = await readLocalJsonp(targetName, 'favorites.js');
const localTweets = (data ? data.favorites : []);

const addedTweets   = tweets.filter(a => localTweets.every(b => a['id_str'] !== b['id_str']));
const removedTweets = localTweets.filter(a => tweets.every(b => a['id_str'] !== b['id_str']));

const mergedTweets = localTweets.concat(addedTweets);
mergedTweets.sort((a, b) => minus(b['id_str'], a['id_str']));

// 
printCountOfTweets(localTweets.length, addedTweets.length, removedTweets.length, tweets.length, mergedTweets.length);

await initDownloadsDirectory(targetName);

await writeLocalJsonp(targetName, 'favorites.js', { favorites: mergedTweets });

// ツイート追加分のみメディアをダウンロード
await downloadTweetMedias(addedTweets);
