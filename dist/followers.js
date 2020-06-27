import Twitter from './inc/twitter.js';
import Profile from './inc/profile.js';
import { initDownloadsDirectory, downloadProfileImage, readLocalJsonp, writeLocalJsonp } from './inc/downloader.js';

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

const printCountOfUsers = (local, added, removed, remote, merged) => {

	console.log('Count of Previous Saved Users: ' + local);
	console.log('Count of Remote Users: ' + local + ' + ' + added + ' - ' + removed + ' = ' + remote);
	console.log('Total Count of Users: ' + local + ' + ' + added + ' = ' + merged);

};

const downloadUserMedias = async users => {

	// メモ: await を使用して直列実行したいため、forEach を使わない
	for (let i = 0; i < users.length; i++) {

		const user = users[i];

		await downloadProfileImage(user, targetName);

		console.log('' + (i + 1) + ' / ' + users.length);

	}

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
printCountOfUsers(localUsers.length, users.length + removedUsers.length - localUsers.length, removedUsers.length, users.length, users.length + removedUsers.length);

await writeLocalJsonp(targetName, 'followers.js', { followers: users, removedFollowers: removedUsers });

// メモ: ユーザーはプロフィールなどを変更されるので、メディアをすべて最新の状態に更新する
await downloadUserMedias(users);
