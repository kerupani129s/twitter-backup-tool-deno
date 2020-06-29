(async () => {

	const importInNoModule = window.importInNoModule;

	await Promise.all([
			importInNoModule('./js/inc/util.js'),
			importInNoModule('./js/inc/util-media.js'),
			importInNoModule('./js/inc/util-user.js'),
			importInNoModule('./js/inc/renderer-users.js'),
			importInNoModule('./jsonp/lists.js')
	]);

	const viewer = window.viewer;
	const lists = window.data.lists;
	const removedLists = window.data.removedLists;

	await Promise.all(lists.map(list => importInNoModule('./jsonp/list.' + list['id_str'] + '.js')));

	const listMembers = window.data.listMembers;
	const removedListMembers = window.data.removedListMembers;

	// 
	const renderListsHeader = (contents, name, lists) => {

		contents.insertAdjacentHTML('beforeend',
				'<header class="content content-header">' +
				name + '<br>' +
				'Total Count: ' + lists.length +
				'</header>');

		return contents.lastElementChild;

	};

	const renderListHeader = (contents, name, users, list) => {

		const nameHTML = '"' + list['name'] + '"' +
			(list['mode'] === 'private' ? '<span class="list-private">&#x1f512;</span>' : '') +
			'<br>' +
			(list['description'] ? viewer.nl2br(list['description']) + '<br>' : '') + '<br>' +
			name;

		return viewer.renderUsersHeader(contents, nameHTML, users);

	};

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

		const mergedLists = lists.concat(removedLists);

		yield renderListsHeader(contents, 'Lists', mergedLists);

		// メモ: yield を使用したいため、forEach を使わない
		for (const list of mergedLists) {

			const listIdStr = list['id_str'];

			const users = listMembers[listIdStr];
			const removedUsers = removedListMembers[listIdStr];

			// 
			yield renderListHeader(contents, 'Members', users, list);

			// メモ: yield を使用したいため、forEach を使わない
			for (const user of users) {
				yield viewer.renderUser(contents, user);
			};

			// 
			yield renderListHeader(contents, 'Removed Members', removedUsers, list);

			// メモ: yield を使用したいため、forEach を使わない
			for (const user of removedUsers) {
				yield viewer.renderUser(contents, user);
			};

		}

	})();

	// 
	loadContent();

})();
