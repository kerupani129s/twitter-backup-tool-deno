import Twitter from './inc/twitter.js';
import Profile from './inc/profile.js';
import { initDownloadsDirectory, downloadProfileImage, readLocalJsonp, writeLocalJsonp } from './inc/downloader.js';
import { print, printCountDiff } from './inc/util-print.js';

// 
const [loginName, targetList] = Deno.args;

const profile = new Profile('./downloads/config.json');
const twitter = new Twitter(await profile.get(loginName));

// 
const getRemoteList = () => {

	const params = {
		'list_id': targetList
	};

	return twitter.get('lists/show', params);

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
const list = await getRemoteList();

const targetName = list['user']['screen_name'];

// 
await initDownloadsDirectory(targetName);

// メモ: 一時的な非公開などで一度削除されたリストが戻ることがあるため、
//       削除済みリストも確認する
// メモ: 対象のリストが削除されているかを確認するにはもう少し厳密に処理する必要があるため、
//       ここでは削除リストを更新しない
// メモ: 対象外のリストは削除確認もメディアファイル更新も行わない
const data = await readLocalJsonp(targetName, 'lists.js');
const localRawLists = (data ? data.lists : []);
const localRemovedLists = (data ? data.removedLists : []);

const addedLists = (localRawLists.every(a => a['id_str'] !== list['id_str']) ? [list] : []);
const removedLists = localRemovedLists.filter(a => a['id_str'] !== list['id_str']);

const lists = localRawLists.concat(addedLists);

// 
printCountDiff('Lists', localRawLists.length + localRemovedLists.length, addedLists.length, lists.length + removedLists.length);

await writeLocalJsonp(targetName, 'lists.js', { lists, removedLists });

// 
const listIdStr = list['id_str'];

// 
const users = await getRemoteUsers(list);

// メモ: 一時的なアカウント削除などで一度削除されたユーザーが戻ることがあるため、
//       削除済みユーザーも一度まとめる
const data2 = await readLocalJsonp(targetName, 'list.' + listIdStr + '.js');
const localUsers = (data2 ? data2.listMembers[listIdStr].concat(data2.removedListMembers[listIdStr]) : []);

const removedUsers = localUsers.filter(a => users.every(b => a['id_str'] !== b['id_str']));

// 
printCountDiff('Users', localUsers.length, users.length + removedUsers.length - localUsers.length, users.length + removedUsers.length, removedUsers.length, users.length);

await writeLocalJsonp(targetName, 'list.' + listIdStr + '.js', {
	['listMembers[\'' + listIdStr + '\']']: users,
	['removedListMembers[\'' + listIdStr + '\']']: removedUsers
}, {
	listMembers: [],
	removedListMembers: []
});

// メモ: ユーザーはプロフィールなどを変更されるので、メディアをすべて最新の状態に更新する
await downloadUserMedias(users);
