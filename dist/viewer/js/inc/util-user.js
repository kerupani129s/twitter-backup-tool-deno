(() => {

	window.viewer = window.viewer || {};

	const viewer = window.viewer;

	// 
	viewer.getUserHTML = user => {

		const profileImageUrlOriginal = viewer.getProfileImageUrlOriginal(user['profile_image_url_https']);

		const description = viewer.replaceEntitiesToLinks(user['description'], user['entities']['description']);

		const urlLink = (user['url'] ? viewer.replaceEntitiesToLinks(user['url'], user['entities']['url']) + '<br>' : '');

		return '<img src="./profile_image/' + viewer.getLocalBaseNameOf(profileImageUrlOriginal) + '" style="width: 48px;"><br>' +
			user['name'] +
			(user['verified'] ? ' <span style="color: #fff; background-color: #08f;">&#x2714;</span>' : '') +
			(user['protected'] ? ' <span style="filter: grayscale(100%); background-color: #000;">&#x1f512;</span>' : '') +
			'<br>' +
			'<a href="https://twitter.com/' + user['screen_name'] + '">@' + user['screen_name'] + '</a><br>' +
			nl2br(description) + '<br>' +
			urlLink;

	};

	// 
	// その他
	// 
	const nl2br = str => str.replace(/\r\n/g, '<br>').replace(/\n|\r/g, '<br>');

})();
