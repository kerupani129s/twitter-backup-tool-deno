(() => {

	window.viewer = window.viewer || {};

	const viewer = window.viewer;

	// 
	viewer.getUserHTML = user => {

		const profileImageUrlOriginal = viewer.getProfileImageUrlOriginal(user['profile_image_url_https']);

		const description = viewer.replaceEntitiesToLinks(user['description'], user['entities']['description']);

		const urlLink = (user['url'] ? viewer.replaceEntitiesToLinks(user['url'], user['entities']['url']) + '<br>' : '');

		return '<img class="user-profile-image" src="./profile_image/' + viewer.getLocalBaseNameOf(profileImageUrlOriginal) + '"><br>' +
			user['name'] +
			(user['verified'] ? '<span class="user-verified">&#x2714;</span>' : '') +
			(user['protected'] ? '<span class="user-protected">&#x1f512;</span>' : '') +
			'<br>' +
			'<a href="https://twitter.com/' + user['screen_name'] + '">@' + user['screen_name'] + '</a><br>' +
			viewer.nl2br(description) + '<br>' +
			urlLink;

	};

})();
