(() => {

	window.viewer = window.viewer || {};

	const viewer = window.viewer;

	// 
	viewer.lazyRenderContents = contentsIterable => {

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

		loadContent();

	};

})();
