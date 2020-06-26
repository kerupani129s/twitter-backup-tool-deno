(() => {

	const viewer = window.viewer;

	// 
	viewer.renderTweetsHeader = (contents, name, tweets) => {

		contents.insertAdjacentHTML('beforeend',
				'<header class="content content-header">' +
				name + '<br>' +
				'Total Count: ' + tweets.length +
				'</header>');

		return contents.lastElementChild;

	};

	viewer.renderTweet = (contents, tweet) => {

		contents.insertAdjacentHTML('beforeend',
				'<article class="content tweet">' +
				viewer.getTweetHTML(tweet) +
				viewer.getTweetMediaHTML(tweet) +
				'</article>');

		return contents.lastElementChild;

	};

})();
