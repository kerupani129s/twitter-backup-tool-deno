(() => {

	const users = window.data.followers;
	const removedUsers = window.data.removedFollowers;
	const viewer = window.viewer;

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

		// 
		yield renderUsersHeader(contents, 'Followers', users);

		// メモ: yield を使用したいため、forEach を使わない
		for (const user of users) {
			yield renderUser(contents, user);
		};

		// 
		yield renderUsersHeader(contents, 'Removed Followers', removedUsers);

		// メモ: yield を使用したいため、forEach を使わない
		for (const user of removedUsers) {
			yield renderUser(contents, user);
		};

	})();

	// 
	const renderUsersHeader = (contents, name, users) => {

		contents.insertAdjacentHTML('beforeend',
				'<header class="content content-header">' +
				name + '<br>' +
				'Total Count: ' + users.length +
				'</header>');

		return contents.lastElementChild;

	};

	const renderUser = (contents, user) => {

		contents.insertAdjacentHTML('beforeend',
				'<article class="content user">' +
				viewer.getUserHTML(user) +
				'</article>');

		return contents.lastElementChild;

	};

	// 
	loadContent();

})();
