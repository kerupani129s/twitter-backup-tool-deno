import Twitter from './inc/twitter.js';
import Profile from './inc/profile.js';
import { initDownloadsDirectory, addTweetMediasData, downloadTweetMedias, readLocalJsonp, writeLocalJsonp, readLocalJson } from './inc/downloader.js';
import { printCountDiff } from './inc/util-print.js';

// 
const [loginName, targetName] = Deno.args;

const profile = new Profile('./downloads/config.json');
const twitter = new Twitter(await profile.get(loginName));

// 
const getRemoteTweets = async ids => {

	const tweets = [];

	// 
	for (let i = 0; i < ids.length; i += 100) {

		const ids100 = ids.slice(i, i + 100);

		const params = {
			'id': ids100.join(','),
			'tweet_mode': 'extended'
		};

		// 
		const result = await twitter.get('statuses/lookup', params);

		ids100.forEach(idStr => {
			const tweet = result.find(tweet => tweet['id_str'] === idStr);
			if ( tweet ) tweets.push(tweet);
		});

	}

	return tweets;

};

// 
await initDownloadsDirectory(targetName);

// 
const ids = await readLocalJson(targetName, 'bookmarks.json') ?? [];

// 
const tweets = await getRemoteTweets(ids);

const data = await readLocalJsonp(targetName, 'bookmarks.js');
const localTweets = (data ? data.bookmarks : []);

const addedTweets   = tweets.filter(a => localTweets.every(b => a['id_str'] !== b['id_str']));
const removedTweets = localTweets.filter(a => tweets.every(b => a['id_str'] !== b['id_str']));

const mergedTweets = addedTweets.concat(localTweets);

printCountDiff('Tweets', localTweets.length, addedTweets.length, mergedTweets.length, removedTweets.length, tweets.length);

// 
addTweetMediasData(addedTweets);

await writeLocalJsonp(targetName, 'bookmarks.js', { bookmarks: mergedTweets });

// 過去に取得したツイートのメディアダウンロードが失敗している場合に、再取得する用
await downloadTweetMedias(targetName, localTweets);

// ツイート追加分のメディアをダウンロード
await downloadTweetMedias(targetName, addedTweets);
