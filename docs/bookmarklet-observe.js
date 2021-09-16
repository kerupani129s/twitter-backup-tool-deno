const tweets = [];

(() => {

	const target = document.querySelector('h1[aria-level="1"] + div[aria-label]');

	const getTweets = () => {

		target.querySelectorAll('article[data-testid="tweet"]').forEach(node => {

			const urls = [...node.getElementsByTagName('a')].map(a => a.href);

			const idStr = urls.map(url => url.match(/status\/([0-9]+)$/)).filter(a => a)[0][1];

			if ( tweets.every(a => a !== idStr) ) {
				tweets.push(idStr);
			}

		});

	};

	const observer = new MutationObserver(mutations => {
		getTweets();
	})

	observer.observe(target, {subtree: true, childList: true});

	getTweets();

})();
