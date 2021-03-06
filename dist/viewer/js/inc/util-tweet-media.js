(() => {

	window.viewer = window.viewer || {};

	const viewer = window.viewer;

	viewer.getTweetMediaHTML = tweet => {

		if ( 'media' in tweet['entities'] ) {
			return tweet['extended_entities']['media'].map(media => '(' + media['type'] + ')<br>' + getMediaTag(media) + '<br>').join('');
		} else {
			return '';
		}

	};

	const getMediaTag = media => {

		const type = media['type'];

		if ( type === 'photo' ) {
			const localFileName = media['_local_media_file_name'];
			// メモ: localFileName は % エンコードされているが、HTML として埋め込むにはさらに % エンコードが必要
			return '<img class="tweet__media" src="./media/' + viewer.percentEncode(localFileName) + '">';
		} else if ( type === 'video' || type === 'animated_gif' ) {
			const localFileName = media['_local_media_file_name'];
			// メモ: localFileName は % エンコードされているが、HTML として埋め込むにはさらに % エンコードが必要
			return '<video class="tweet__media" controls loop preload="metadata" src="./media/' + viewer.percentEncode(localFileName) + '"></video>';
		}

		return '';

	};

})();
