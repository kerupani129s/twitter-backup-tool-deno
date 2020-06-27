(() => {

	window.viewer = window.viewer || {};

	const viewer = window.viewer;

	// 
	viewer.renderUsersHeader = (contents, name, users) => {

		contents.insertAdjacentHTML('beforeend',
				'<header class="content content-header">' +
				name + '<br>' +
				'Total Count: ' + users.length +
				'</header>');

		return contents.lastElementChild;

	};

	viewer.renderUser = (contents, user) => {

		contents.insertAdjacentHTML('beforeend',
				'<article class="content user">' +
				viewer.getUserHTML(user) +
				'</article>');

		return contents.lastElementChild;

	};

})();
