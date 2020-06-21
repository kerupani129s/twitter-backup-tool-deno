import Twitter from './inc/twitter.js';
import Profile from './inc/profile.js';
import { initDownloadsDirectory, downloadJsonp, downloadProfileImage, readLocalJsonp } from './inc/downloader.js';

// 
const [loginName, targetName] = Deno.args;

const profile = new Profile('./downloads/config.json');
const twitter = new Twitter(await profile.get(loginName));

// 
const params = {
	'screen_name': targetName,
	'skip_status': true,
	'count': 100
};

// 
const users = [];

do {

	const result = await twitter.get('followers/list', params);

	if ( result.length === 0 ) break;

	result['users'].forEach(user => {
		users.push(user);
	});

	// 
	params['cursor'] = result['next_cursor_str'];

} while ( params['cursor'] !== '0' );

// 
const data = await readLocalJsonp(targetName, 'followers.js');

// メモ: 一時的なアカウント削除などで一度削除されたユーザーが戻ることがあるため、
//       削除済みユーザーも一度追加
const localUsers = (data ? data.followers.concat(data.removedFollowers) : []);

const removedUsers = localUsers.filter(a => users.every(b => a['id_str'] !== b['id_str']));

// 
console.log('Count of Previous Saved Users: ' + localUsers.length);
console.log('Count of Remote Users: ' + localUsers.length + ' + ' + (users.length + removedUsers.length - localUsers.length) + ' - ' + removedUsers.length + ' = ' + users.length);
console.log('Total Count of Users: ' + localUsers.length + ' + ' + (users.length + removedUsers.length - localUsers.length) + ' = ' + (users.length + removedUsers.length));

// 
await initDownloadsDirectory(targetName);

const jsonp = 'window.data = window.data || {};\n\n' +
'window.data.followers = ' + JSON.stringify(users, null, 4) + ';\n\n' +
'window.data.removedFollowers = ' + JSON.stringify(removedUsers, null, 4) + ';\n';
await downloadJsonp(targetName, 'followers.js', jsonp);

// メモ: ユーザーはプロフィールなどを変更されるので、すべて最新の状態に更新する
// メモ: await を使用して直列実行したいため、forEach を使わない
for (let i = 0; i < users.length; i++) {

	const user = users[i];

	await downloadProfileImage(user, targetName);

	console.log('' + (i + 1) + ' / ' + users.length);

}
