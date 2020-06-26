(() => {

	const tweets = window.data.favorites;
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
		yield viewer.renderTweetsHeader(contents, 'Favorites', tweets);

		// メモ: yield を使用したいため、forEach を使わない
		for (const tweet of tweets) {
			yield viewer.renderTweet(contents, tweet);
		};

	})();

	// 
	loadContent();

})();
