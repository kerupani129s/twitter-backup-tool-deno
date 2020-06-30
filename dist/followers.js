import Twitter from './inc/twitter.js';
import Profile from './inc/profile.js';
import { initDownloadsDirectory, downloadProfileImage, readLocalJsonp, writeLocalJsonp } from './inc/downloader.js';
import { print, printCountDiff } from './inc/util-print.js';

// 
const [loginName, targetName] = Deno.args;

const profile = new Profile('./downloads/config.json');
const twitter = new Twitter(await profile.get(loginName));

// 
const getRemoteUsers = async () => {

	const params = {
		'screen_name': targetName,
		'skip_status': true,
		'count': 100
	};

	// 
	const users = [];

	do {

		const result = await twitter.get('followers/list', params);

		result['users'].forEach(user => {
			users.push(user);
		});

		// 
		params['cursor'] = result['next_cursor_str'];

	} while ( params['cursor'] !== '0' );

	return users;

};

const downloadUserMedias = async users => {

	if ( users.length === 0 ) return;

	print('\n');

	// メモ: await を使用して直列実行したいため、forEach を使わない
	for (let i = 0; i < users.length; i++) {

		const user = users[i];

		await downloadProfileImage(user, targetName);

		print('' + (i + 1) + ' / ' + users.length + '\r');

	}

	print('\n');

};

// 
await initDownloadsDirectory(targetName);

// 
const users = await getRemoteUsers();

// メモ: 一時的なアカウント削除などで一度削除されたユーザーが戻ることがあるため、
//       削除済みユーザーも一度まとめる
const data = await readLocalJsonp(targetName, 'followers.js');
const localUsers = (data ? data.followers.concat(data.removedFollowers) : []);

const removedUsers = localUsers.filter(a => users.every(b => a['id_str'] !== b['id_str']));

// 
printCountDiff('Users', localUsers.length, users.length + removedUsers.length - localUsers.length, users.length + removedUsers.length, removedUsers.length, users.length);

await writeLocalJsonp(targetName, 'followers.js', { followers: users, removedFollowers: removedUsers });

// メモ: ユーザーはプロフィールなどを変更されるので、メディアをすべて最新の状態に更新する
await downloadUserMedias(users);
