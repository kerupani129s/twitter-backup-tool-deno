(() => {

	window.viewer = window.viewer || {};

	const viewer = window.viewer;

	// 
	viewer.getImageUrlLarge = urlDefault => {
		return urlDefault; // メモ: 2020/02/22 現在はそのままの URL
	};

	viewer.getVideoUrlLargeMp4 = media => {

		const variantsMp4 = media['video_info']['variants'].filter(variant => variant['content_type'] === 'video/mp4');

		variantsMp4.sort((a, b) => b['bitrate'] - a['bitrate']);

		return variantsMp4[0]['url'];

	};

	// 
	viewer.getProfileImageUrlOriginal = normal => normal.replace('_normal.', '.');

	// 
	viewer.getLocalTweetMediaFileName = mediaUrl => {

		const {dir, name, ext, query} = parsePath(mediaUrl);

		const localFileNameRaw = name + (query !== '' ? ext + query + ext : ext);

		return viewer.percentEncode(localFileNameRaw);

	};

	viewer.getLocalProfileImageFileName = mediaUrl => {

		const {dir, name, ext, query} = parsePath(mediaUrl);

		const matchedIdStr = dir.match(/\/([0-9]+)\//) || [];
		const [, idStr] = matchedIdStr.map(match => match || '');

		const localFileNameRaw = idStr + '/' + name + (query !== '' ? ext + query + ext : ext);

		return viewer.percentEncode(localFileNameRaw);

	};

	const parsePath = url => {

		const matchedFileName = url.match(/^(?:[^:\/?#]+:)?(?:\/\/[^\/?#]*)?(?:([^?#]*\/)([^\/?#]*))?(\?[^#]*)?(?:#.*)?$/) || [];
		const [, dir, fileName, query] = matchedFileName.map(match => match || '');

		const matchedExt = fileName.match(/^(.+?)(\.[^.]+)?$/) || [];
		const [, name, ext] = matchedExt.map(match => match || '');

		return {dir, name, ext, query};

	};

	// 
	/**
	 * RFC3986 仕様の encodeURIComponent
	 * 
	 * メモ: ここでは RFC3986 仕様である必要はないが、混乱を避けるため仕様を統一
	 */
	viewer.percentEncode = str =>
		encodeURIComponent(str).replace(/[!'()*]/g, char => '%' + char.charCodeAt().toString(16));

})();
