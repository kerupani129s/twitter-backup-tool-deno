import { minus } from 'https://deno.land/x/math@v1.1.0/mod.ts';

import Twitter from './inc/twitter.js';
import Profile from './inc/profile.js';
import { initDownloadsDirectory, downloadJsonp, downloadTweetMedia, downloadProfileImage } from './inc/downloader.js';

// 
const [loginName, targetName] = Deno.args;

const profile = new Profile('./downloads/config.json');
const twitter = new Twitter(await profile.get(loginName));

// 
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

// 
console.log('Total Count: ' + tweets.length);

// 
const jsonp = 'globalThis.data = globalThis.data || {};\n\nglobalThis.data.tweets = ' + JSON.stringify(tweets, null, 4) + ';';

// 
await initDownloadsDirectory(targetName);

await downloadJsonp(targetName, 'favorites.js', jsonp);

// メモ: await を使用して直列実行したいため、forEach を使わない
for (let i = 0; i < tweets.length; i++) {
	const tweet = tweets[i];
	await downloadProfileImage(tweet['user'], targetName);
	await downloadTweetMedia(tweet, targetName);
	console.log('' + (i + 1) + ' / ' + tweets.length);
}
