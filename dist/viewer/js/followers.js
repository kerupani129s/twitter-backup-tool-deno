(async () => {

	const importInNoModule = window.importInNoModule;

	await Promise.all([
			importInNoModule('./js/inc/util.js'),
			importInNoModule('./js/inc/util-media.js'),
			importInNoModule('./js/inc/util-user.js'),
			importInNoModule('./js/inc/lazy-render.js'),
			importInNoModule('./js/inc/renderer-users.js'),
			importInNoModule('./jsonp/followers.js')
	]);

	const viewer = window.viewer;
	const users = window.data.followers;
	const removedUsers = window.data.removedFollowers;

	// 
	const contentsIterable = (function*() {

		const contents = document.getElementById('contents');

		// 
		yield viewer.renderUsersHeader(contents, 'Followers', users);

		// メモ: yield を使用したいため、forEach を使わない
		for (const user of users) {
			yield viewer.renderUser(contents, user);
		};

		// 
		yield viewer.renderUsersHeader(contents, 'Removed Followers', removedUsers);

		// メモ: yield を使用したいため、forEach を使わない
		for (const user of removedUsers) {
			yield viewer.renderUser(contents, user);
		};

	})();

	// 
	viewer.lazyRenderContents(contentsIterable);

})();
