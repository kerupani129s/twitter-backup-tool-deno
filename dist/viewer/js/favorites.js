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
		yield renderTweetsHeader(contents, 'Favorites', tweets);

		// メモ: yield を使用したいため、forEach を使わない
		for (const tweet of tweets) {
			yield renderTweet(contents, tweet);
		};

	})();

	// 
	const renderTweetsHeader = (contents, name, tweets) => {

		contents.insertAdjacentHTML('beforeend',
				'<header class="content content-header">' +
				name + '<br>' +
				'Total Count: ' + tweets.length +
				'</header>');

		return contents.lastElementChild;

	};

	const renderTweet = (contents, tweet) => {

		contents.insertAdjacentHTML('beforeend',
				'<article class="content tweet">' +
				viewer.getTweetHTML(tweet) +
				viewer.getTweetMediaHTML(tweet) +
				'</article>');

		return contents.lastElementChild;

	};

	// 
	loadContent();

})();
