(() => {

	const tweets = window.data.tweets;
	const viewer = window.viewer;

	// 
	const contents = document.getElementById('contents');

	contents.insertAdjacentHTML('beforeend', '<div>Total Count: ' + tweets.length + '</div><br>');

	// 
	const infiniteScrollObserver = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if ( ! entry.isIntersecting ) return;

			infiniteScrollObserver.unobserve(entry.target);
			loadContent();

		});
	});

	// 
	let i = 0;

	const loadContent = () => {

		const tweet = tweets[i];

		contents.insertAdjacentHTML('beforeend',
				'<article>' +
				viewer.getTweetHTML(tweet) +
				viewer.getTweetMediaHTML(tweet) +
				'<br></article>');

		// 
		i++;

		if ( i < tweets.length ) infiniteScrollObserver.observe(contents.lastElementChild);

	};

	// 
	loadContent();

})();
