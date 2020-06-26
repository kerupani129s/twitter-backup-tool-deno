(() => {

	window.viewer = window.viewer || {};

	const viewer = window.viewer;

	// 
	// ツイート > 常に表示される部分
	// 
	viewer.getTweetHTML = tweet => {

		if ( 'retweeted_status' in tweet ) {
			return getTweetReplayingToTweetLink(tweet['retweeted_status']) +
				getTweetRetweetedLink(tweet) +
				getTweetMainHTML(tweet['retweeted_status']);
		} else {
			return getTweetReplayingToTweetLink(tweet) +
				getTweetMainHTML(tweet);
		}

	};

	const getTweetMainHTML = tweet =>
		getTweetUserHTML(tweet['user']) +
		getCreatedAtLink(tweet) + '<br>' +
		getTweetReplayingToUserLink(tweet) +
		getTweetFullText(tweet) + '<br>';

	const getTweetUserHTML = user => {

		const profileImageUrlOriginal = viewer.getProfileImageUrlOriginal(user['profile_image_url_https']);

		return '<img class="user-profile-image" src="./profile_image/' + viewer.getLocalBaseNameOf(profileImageUrlOriginal) + '"><br>' +
			user['name'] +
			(user['verified'] ? '<span class="user-verified">&#x2714;</span>' : '') +
			(user['protected'] ? '<span class="user-protected">&#x1f512;</span>' : '') +
			'<br>' +
			'<a href="https://twitter.com/' + user['screen_name'] + '">@' + user['screen_name'] + '</a><br>';

	};

	const getCreatedAtLink = tweet =>
		'<a href="https://twitter.com/' + tweet['user']['screen_name'] + '/status/' + tweet['id_str'] + '">' + tweet['created_at'] + '</a>';

	const getTweetFullText = tweet => {

		const fullText = viewer.replaceEntitiesToLinks(tweet['full_text'], tweet['entities'], tweet['display_text_range']);

		return viewer.nl2br(fullText);

	};

	// 
	// ツイート > 状況に応じて表示される部分
	// 
	const getTweetReplayingToTweetLink = tweet =>
		(tweet['in_reply_to_status_id_str'] ? getTweetLink(tweet['in_reply_to_screen_name'], tweet['in_reply_to_status_id_str']) + '<br>｜<br>' : '');

	const getTweetLink = (screenName, statusIdStr) => {
		const tweetUrl = 'https://twitter.com/' + screenName + '/status/' + statusIdStr;
		return '<a href="' + tweetUrl + '">' + tweetUrl + '</a>';
	};

	const getTweetRetweetedLink = tweet => {
		const user = tweet['user'];
		return '&#x1f503; <a href="https://twitter.com/' + user['screen_name'] + '">' + user['name'] + '</a> Retweeted at ' + tweet['created_at'] + '<br>';
	};

	const getTweetReplayingToUserLink = tweet => {

		if ( ! tweet['in_reply_to_status_id_str'] ) return '';

		const mentionScreenNames = tweet['entities']['user_mentions'].map(user => user['screen_name']);
		const replayingToScreenNames = mentionScreenNames
			.filter(screenName => screenName !== tweet['in_reply_to_screen_name']);

		replayingToScreenNames.unshift(tweet['in_reply_to_screen_name']);

		if ( replayingToScreenNames.length === 1 && replayingToScreenNames[0] === tweet['user']['screen_name'] ) return '';

		const userLinks = replayingToScreenNames.map(screenName => '<a href="https://twitter.com/' + screenName + '">@' + screenName + '</a>');

		return 'Replying to ' + userLinks.join(' ') + '<br>';

	};

})();
