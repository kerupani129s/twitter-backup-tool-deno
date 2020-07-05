import { minus } from 'https://deno.land/x/math@v1.1.0/mod.ts';

import Twitter from './inc/twitter.js';
import Profile from './inc/profile.js';
import { initDownloadsDirectory, addTweetMediasData, downloadTweetMedias, readLocalJsonp, writeLocalJsonp } from './inc/downloader.js';
import { printCountDiff } from './inc/util-print.js';

// 
const [loginName, targetName] = Deno.args;

const profile = new Profile('./downloads/config.json');
const twitter = new Twitter(await profile.get(loginName));

// 
const getRemoteTweets = async (sinceId = null) => {

	const params = {
		'screen_name': targetName,
		'count': 200,
		'tweet_mode': 'extended'
	};

	if ( sinceId ) params['since_id'] = sinceId;

	// 
	const tweets = [];

	while (true) {

		const result = await twitter.get('statuses/user_timeline', params);

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
const data = await readLocalJsonp(targetName, 'user-timeline.js');
const localTweets = (data ? data.userTimeline : []);

const localNewestTweet = localTweets[0];
const localNewestTweetIdStr = (localNewestTweet ? localNewestTweet['id_str'] : null);
const sinceId = (localNewestTweetIdStr ? minus(localNewestTweetIdStr, 1) : null);

const tweets = await getRemoteTweets(sinceId);

const oldestTweet = (tweets.length > 0 ? tweets[tweets.length - 1] : null);
const oldestTweetIdStr = (oldestTweet ? oldestTweet['id_str'] : null);

if ( localNewestTweetIdStr && oldestTweetIdStr && localNewestTweetIdStr === oldestTweetIdStr ) {
	tweets.pop();
} else if ( oldestTweet ) {
	oldestTweet['_prev_status_is_unknown'] = true;
}

const addedTweets  = tweets;
const mergedTweets = tweets.concat(localTweets);

printCountDiff('Tweets', localTweets.length, addedTweets.length, mergedTweets.length);

// 
addTweetMediasData(addedTweets);

await writeLocalJsonp(targetName, 'user-timeline.js', { userTimeline: mergedTweets });

// 過去に取得したツイートのメディアダウンロードが失敗している場合に、再取得する用
await downloadTweetMedias(targetName, localTweets);

// ツイート追加分のメディアをダウンロード
await downloadTweetMedias(targetName, addedTweets);
