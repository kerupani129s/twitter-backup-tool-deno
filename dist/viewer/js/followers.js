(async () => {

	const importInNoModule = window.importInNoModule;

	await Promise.all([
			importInNoModule('./js/inc/util.js'),
			importInNoModule('./js/inc/util-user.js'),
			importInNoModule('./js/inc/lazy-renderer.js'),
			importInNoModule('./js/inc/renderer-users.js'),
			importInNoModule('./jsonp/followers.js').catch(() => {})
	]);

	const viewer = window.viewer;
	const data = window.data;

	const users = (data ? data.followers : null);
	const removedUsers = (data ? data.removedFollowers : null);

	// 
	if ( ! users || ! removedUsers ) {

		const contents = document.getElementById('contents');

		contents.insertAdjacentHTML('beforeend', '<header class="content content-header">Followers</header>');

		contents.insertAdjacentHTML('beforeend', '<pre><code>./deno-run.sh followers.js &lt;loginName&gt; &lt;@targetName&gt;</code></pre>');

		return;

	}

	// 
	const contentsIterable = (function*() {

		const contents = document.getElementById('contents');

		// 
		yield viewer.renderUsersHeader(contents, 'Followers', users);

		// メモ: yield を使用したいため、forEach を使わない
		for (const user of users) {
			yield viewer.renderUser(contents, user);
		}

		// 
		yield viewer.renderUsersHeader(contents, 'Removed Followers', removedUsers);

		// メモ: yield を使用したいため、forEach を使わない
		for (const user of removedUsers) {
			yield viewer.renderUser(contents, user);
		}

	})();

	// 
	viewer.lazyRenderContents(contentsIterable);

})();
