(async () => {

	const importInNoModule = window.importInNoModule;

	await Promise.all([
			importInNoModule('./js/inc/util.js'),
			importInNoModule('./js/inc/util-user.js'),
			importInNoModule('./js/inc/util-list.js'),
			importInNoModule('./js/inc/lazy-renderer.js'),
			importInNoModule('./js/inc/renderer-users.js'),
			importInNoModule('./jsonp/lists.js').catch(() => {})
	]);

	const viewer = window.viewer;
	const data = window.data;

	const lists = (data ? data.lists : null);
	const removedLists = (data ? data.removedLists : null);

	// 
	if ( ! lists || ! removedLists ) {

		const contents = document.getElementById('contents');

		contents.insertAdjacentHTML('beforeend', '<header class="content content-header">Lists</header>');

		contents.insertAdjacentHTML('beforeend', '<pre><code>./deno-run.sh lists.js &lt;loginName&gt; &lt;@targetName&gt;</code></pre>');
		contents.insertAdjacentHTML('beforeend', '<p>or</p>');
		contents.insertAdjacentHTML('beforeend', '<pre><code>./deno-run.sh list.js &lt;loginName&gt; &lt;targetListId&gt;</code></pre>');

		return;

	}

	// 
	const mergedLists = lists.concat(removedLists);

	await Promise.all(mergedLists.map(list => importInNoModule('./jsonp/list.' + list['id_str'] + '.js')));

	const listMembers = window.data.listMembers;
	const removedListMembers = window.data.removedListMembers;

	// 
	const contentsIterable = (function*() {

		const contents = document.getElementById('contents');

		yield viewer.renderListsHeader(contents, 'Lists', mergedLists);

		// メモ: yield を使用したいため、forEach を使わない
		for (const list of mergedLists) {

			const listIdStr = list['id_str'];

			const users = listMembers[listIdStr];
			const removedUsers = removedListMembers[listIdStr];

			// 
			viewer.renderListHeader(contents, list);

			// 
			yield viewer.renderUsersHeader(contents, 'Members', users);

			// メモ: yield を使用したいため、forEach を使わない
			for (const user of users) {
				yield viewer.renderUser(contents, user);
			};

			// 
			yield viewer.renderUsersHeader(contents, 'Removed Members', removedUsers);

			// メモ: yield を使用したいため、forEach を使わない
			for (const user of removedUsers) {
				yield viewer.renderUser(contents, user);
			};

		}

	})();

	// 
	viewer.lazyRenderContents(contentsIterable);

})();
