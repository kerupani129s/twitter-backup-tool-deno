(() => {

	const users = window.data.followers;
	const removedUsers = window.data.removedFollowers;
	const viewer = window.viewer;

	// 
	const contents = document.getElementById('contents');

	contents.insertAdjacentHTML('beforeend', '<div>Total Count: ' + users.length + '</div><br>');

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

		// メモ: yield を使用したいため、forEach を使わない
		for (const user of users) {

			contents.insertAdjacentHTML('beforeend',
					'<article>' +
					viewer.getUserHTML(user) +
					'<br></article>');

			yield contents.lastElementChild;

		};

	})();

	// 
	loadContent();

})();
