(() => {

	window.viewer = window.viewer || {};

	const viewer = window.viewer;

	// 
	viewer.renderListsHeader = (contents, name, lists) => {

		contents.insertAdjacentHTML('beforeend',
				'<header class="content content-header">' +
				name + '<br>' +
				'Total Count: ' + lists.length +
				'</header>');

		return contents.lastElementChild;

	};

	// 
	viewer.renderListHeader = (contents, list) => {

		contents.insertAdjacentHTML('beforeend',
				'<header class="content content-header">' +
				'"' + list['name'] + '"' +
				(list['mode'] === 'private' ? '<span class="list-private">&#x1f512;</span>' : '') +
				'<br>' +
				(list['description'] ? viewer.nl2br(list['description']) + '<br>' : '') +
				getListUserHTML(list['user']) +
				'</header>');

		return contents.lastElementChild;

	};

	const getListUserHTML = user => {

		const profileImageUrlOriginal = viewer.getProfileImageUrlOriginal(user['profile_image_url_https']);

		return '<img class="user-profile-image" src="./profile_image/' + viewer.getLocalBaseNameOf(profileImageUrlOriginal) + '"><br>' +
			user['name'] +
			(user['verified'] ? '<span class="user-verified">&#x2714;</span>' : '') +
			(user['protected'] ? '<span class="user-protected">&#x1f512;</span>' : '') +
			'<br>' +
			'<a href="https://twitter.com/' + user['screen_name'] + '">@' + user['screen_name'] + '</a><br>';

	};

})();
