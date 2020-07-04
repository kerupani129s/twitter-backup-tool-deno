(async () => {

	const importInNoModule = window.importInNoModule;

	await Promise.all([
			importInNoModule('./js/inc/util.js'),
			importInNoModule('./js/inc/util-media.js'),
			importInNoModule('./js/inc/util-user.js'),
			importInNoModule('./js/inc/lazy-render.js'),
			importInNoModule('./js/inc/renderer-users.js'),
			importInNoModule('./jsonp/following.js')
	]);

	const viewer = window.viewer;
	const users = window.data.following;
	const removedUsers = window.data.removedFollowing;

	// 
	const contentsIterable = (function*() {

		const contents = document.getElementById('contents');

		// 
		yield viewer.renderUsersHeader(contents, 'Following', users);

		// メモ: yield を使用したいため、forEach を使わない
		for (const user of users) {
			yield viewer.renderUser(contents, user);
		};

		// 
		yield viewer.renderUsersHeader(contents, 'Removed Following', removedUsers);

		// メモ: yield を使用したいため、forEach を使わない
		for (const user of removedUsers) {
			yield viewer.renderUser(contents, user);
		};

	})();

	// 
	viewer.lazyRenderContents(contentsIterable);

})();
