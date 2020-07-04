(async () => {

	const importInNoModule = window.importInNoModule;

	await Promise.all([
			importInNoModule('./js/inc/util.js'),
			importInNoModule('./js/inc/util-tweet.js'),
			importInNoModule('./js/inc/util-tweet-media.js'),
			importInNoModule('./js/inc/lazy-renderer.js'),
			importInNoModule('./js/inc/renderer-tweets.js'),
			importInNoModule('./jsonp/favorites.js')
	]);

	const viewer = window.viewer;
	const tweets = window.data.favorites;

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
