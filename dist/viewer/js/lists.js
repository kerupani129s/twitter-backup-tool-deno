(async () => {

	const importInNoModule = window.importInNoModule;

	await Promise.all([
			importInNoModule('./js/inc/util.js'),
			importInNoModule('./js/inc/util-media.js'),
			importInNoModule('./js/inc/util-user.js'),
			importInNoModule('./js/inc/util-list.js'),
			importInNoModule('./js/inc/renderer-users.js'),
			importInNoModule('./jsonp/lists.js')
	]);

	const viewer = window.viewer;
	const lists = window.data.lists;
	const removedLists = window.data.removedLists;

	const mergedLists = lists.concat(removedLists);

	await Promise.all(mergedLists.map(list => importInNoModule('./jsonp/list.' + list['id_str'] + '.js')));

	const listMembers = window.data.listMembers;
	const removedListMembers = window.data.removedListMembers;

	// 
	const infiniteScrollObserver = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if ( ! entry.isIntersecting ) return;

			infiniteScrollObserver.unobserve(entry.target);
			loadContent();

		});
	});

	const loadContent = () => {

		const nextContent = contentsIterable.next();

		if ( ! nextContent.done )
			infiniteScrollObserver.observe(nextContent.value);

	};

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
	loadContent();

})();
