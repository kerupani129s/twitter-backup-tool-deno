(async () => {

	const importInNoModule = window.importInNoModule;

	await Promise.all([
			importInNoModule('./js/inc/util.js'),
			importInNoModule('./js/inc/util-tweet.js'),
			importInNoModule('./js/inc/util-tweet-media.js'),
			importInNoModule('./js/inc/lazy-renderer.js'),
			importInNoModule('./js/inc/renderer-tweets.js'),
			importInNoModule('./jsonp/favorites.js').catch(() => {})
	]);

	const viewer = window.viewer;
	const data = window.data;

	const tweets = (data ? data.favorites : null);

	// 
	if ( ! tweets ) {

		const contents = document.getElementById('contents');

		contents.insertAdjacentHTML('beforeend', '<header class="content content-header">Favorites</header>');

		contents.insertAdjacentHTML('beforeend', '<pre><code>./deno-run.sh favorites.js &lt;loginName&gt; &lt;@targetName&gt;</code></pre>');

		return;

	}

	// 
	const contentsIterable = (function*() {

		const contents = document.getElementById('contents');

		// 
		yield viewer.renderTweetsHeader(contents, 'Favorites', tweets);

		// メモ: yield を使用したいため、forEach を使わない
		for (const tweet of tweets) {
			yield viewer.renderTweet(contents, tweet);
		};

	})();

	// 
	viewer.lazyRenderContents(contentsIterable);

})();
