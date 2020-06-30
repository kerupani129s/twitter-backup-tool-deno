import { minus } from 'https://deno.land/x/math@v1.1.0/mod.ts';

import Twitter from './inc/twitter.js';
import Profile from './inc/profile.js';
import { initDownloadsDirectory, downloadTweetMedias, readLocalJsonp, writeLocalJsonp } from './inc/downloader.js';
import { printCountDiff } from './inc/util-print.js';

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

// 
await initDownloadsDirectory(targetName);

// 
const tweets = await getRemoteTweets();

// メモ: 「いいね」はツイートの投稿日時順に取得されるため、過去のツイートが追加される可能性があるので、
//       過去のツイートの追加・削除を全て確認する
const data = await readLocalJsonp(targetName, 'favorites.js');
const localTweets = (data ? data.favorites : []);

const addedTweets   = tweets.filter(a => localTweets.every(b => a['id_str'] !== b['id_str']));
const removedTweets = localTweets.filter(a => tweets.every(b => a['id_str'] !== b['id_str']));

const mergedTweets = localTweets.concat(addedTweets);
mergedTweets.sort((a, b) => minus(b['id_str'], a['id_str']));

// 
printCountDiff('Tweets', localTweets.length, addedTweets.length, mergedTweets.length, removedTweets.length, tweets.length);

await writeLocalJsonp(targetName, 'favorites.js', { favorites: mergedTweets });

// ツイート追加分のみメディアをダウンロード
await downloadTweetMedias(targetName, addedTweets);
