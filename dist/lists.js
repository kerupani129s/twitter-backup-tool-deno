import Twitter from './inc/twitter.js';
import Profile from './inc/profile.js';
import { initDownloadsDirectory, addUserMediasData, downloadUserMedias, readLocalJsonp, writeLocalJsonp } from './inc/downloader.js';
import { printCountDiff } from './inc/util-print.js';

// 
const [loginName, targetName] = Deno.args;

const profile = new Profile('./downloads/config.json');
const twitter = new Twitter(await profile.get(loginName));

// 
const getRemoteLists = async () => {

	const params = {
		'screen_name': targetName,
		'count': 100
	};

	// 
	const lists = [];

	do {

		const result = await twitter.get('lists/ownerships', params);

		result['lists'].forEach(list => {
			lists.push(list);
		});

		// 
		params['cursor'] = result['next_cursor_str'];

	} while ( params['cursor'] !== '0' );

	return lists;

};

// 
const getRemoteUsers = async list => {

	const params = {
		'list_id': list['id_str'],
		'skip_status': true,
		'count': 100
	};

	// 
	const users = [];

	do {

		const result = await twitter.get('lists/members', params);

		result['users'].forEach(user => {
			users.push(user);
		});

		// 
		params['cursor'] = result['next_cursor_str'];

	} while ( params['cursor'] !== '0' );

	return users;

};

// 
await initDownloadsDirectory(targetName);

// 
const lists = await getRemoteLists();

// メモ: 一時的な非公開などで一度削除されたリストが戻ることがあるため、
//       削除済みリストも一度まとめる
const data = await readLocalJsonp(targetName, 'lists.js');
const localLists = (data ? data.lists.concat(data.removedLists) : []);

const removedLists = localLists.filter(a => lists.every(b => a['id_str'] !== b['id_str']));

printCountDiff('Lists', localLists.length, lists.length + removedLists.length - localLists.length, lists.length + removedLists.length, removedLists.length, lists.length);

// 
const removedListOwners = removedLists.map(list => list['user']);
const listOwners = lists.map(list => list['user']);

// TODO: 引き継ぎ用
addUserMediasData(removedListOwners);

// 
addUserMediasData(listOwners);

await writeLocalJsonp(targetName, 'lists.js', { lists, removedLists });

// メモ: ユーザーはプロフィールなどを変更されるので、メディアをすべて最新の状態に更新する
await downloadUserMedias(targetName, listOwners);

// メモ: await を使用して直列実行したいため、forEach を使わない
for (const list of lists) {

	const listIdStr = list['id_str'];

	// 
	const users = await getRemoteUsers(list);

	// メモ: 一時的なアカウント削除などで一度削除されたユーザーが戻ることがあるため、
	//       削除済みユーザーも一度まとめる
	const data = await readLocalJsonp(targetName, 'list.' + listIdStr + '.js');
	const localUsers = (data ? data.listMembers[listIdStr].concat(data.removedListMembers[listIdStr]) : []);

	const removedUsers = localUsers.filter(a => users.every(b => a['id_str'] !== b['id_str']));

	printCountDiff('Users', localUsers.length, users.length + removedUsers.length - localUsers.length, users.length + removedUsers.length, removedUsers.length, users.length);

	// TODO: 引き継ぎ用
	addUserMediasData(removedUsers);

	// 
	addUserMediasData(users);

	await writeLocalJsonp(targetName, 'list.' + listIdStr + '.js', {
		['listMembers[\'' + listIdStr + '\']']: users,
		['removedListMembers[\'' + listIdStr + '\']']: removedUsers
	}, {
		listMembers: [],
		removedListMembers: []
	});

	// メモ: ユーザーはプロフィールなどを変更されるので、メディアをすべて最新の状態に更新する
	await downloadUserMedias(targetName, users);

}
