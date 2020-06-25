(() => {

	const tweets = window.data.favorites;
	const viewer = window.viewer;

	// 
	const contents = document.getElementById('contents');

	// 
	const infiniteScrollObserver = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if ( ! entry.isIntersecting ) return;

			infiniteScrollObserver.unobserve(entry.target);
			loadContent();

		});
	});

	// 
	const loadContent = () => {

		const nextContent = contentsIterable.next();

		if ( ! nextContent.done )
			infiniteScrollObserver.observe(nextContent.value);

	};

	const contentsIterable = (function*() {

		// 
		contents.insertAdjacentHTML('beforeend', '<header>Total Count: ' + tweets.length + '<br><br></header>');

		yield contents.lastElementChild;

		// メモ: yield を使用したいため、forEach を使わない
		for (const tweet of tweets) {

			contents.insertAdjacentHTML('beforeend',
					'<article>' +
					viewer.getTweetHTML(tweet) +
					viewer.getTweetMediaHTML(tweet) +
					'<br></article>');

			yield contents.lastElementChild;

		};

	})();

	// 
	loadContent();

})();
