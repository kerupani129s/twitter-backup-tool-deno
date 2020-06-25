(() => {

	const users = window.data.followers;
	const removedUsers = window.data.removedFollowers;
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
		contents.insertAdjacentHTML('beforeend', '<header class="content content-header">Total Count: ' + users.length + '</header>');

		yield contents.lastElementChild;

		// メモ: yield を使用したいため、forEach を使わない
		for (const user of users) {

			contents.insertAdjacentHTML('beforeend',
					'<article class="content user">' +
					viewer.getUserHTML(user) +
					'</article>');

			yield contents.lastElementChild;

		};

	})();

	// 
	loadContent();

})();
