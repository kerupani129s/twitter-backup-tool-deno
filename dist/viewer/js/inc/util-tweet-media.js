(() => {

	globalThis.viewer = globalThis.viewer || {};

	const viewer = globalThis.viewer;

	viewer.getTweetMediaHTML = tweet => {

		if ( 'media' in tweet['entities'] ) {
			return tweet['extended_entities']['media'].map(media => '(' + media['type'] + ')<br>' + getMediaTag(media) + '<br>').join('')
		} else {
			return '';
		}

	};

	const getMediaTag = media => {

		const type = media['type'];

		if ( type === 'photo' ) {
			const mediaUrl = viewer.getImageUrlLarge(media['media_url_https']);
			const localPath = viewer.getLocalBaseNameOf(mediaUrl);
			// メモ: localPath は % エンコードされているが、HTML として埋め込むにはさらに % エンコードが必要
			return '<img style="max-width: 360px;" src="./media/' + viewer.percentEncode(localPath) + '">';
		} else if ( type === 'video' || type === 'animated_gif' ) {
			const mediaUrl = viewer.getVideoUrlLargeMp4(media);
			const localPath = viewer.getLocalBaseNameOf(mediaUrl);
			// メモ: localPath は % エンコードされているが、HTML として埋め込むにはさらに % エンコードが必要
			return '<video style="max-width: 360px;" controls preload="metadata" src="./media/' + viewer.percentEncode(localPath) + '"></video>';
		}

		return '';

	};

})();
