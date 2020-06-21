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
	let i = 0;

	const loadContent = () => {

		const user = users[i];

		contents.insertAdjacentHTML('beforeend',
				'<article>' +
				viewer.getUserHTML(user) +
				'<br></article>');

		// 
		i++;

		if ( i < users.length ) infiniteScrollObserver.observe(contents.lastElementChild);

	};

	// 
	loadContent();

})();
