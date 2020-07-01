(() => {

	window.viewer = window.viewer || {};

	const viewer = window.viewer;

	// 
	// 
	// 
	viewer.getImageUrlLarge = urlDefault => {
		return urlDefault; // メモ: 2020/02/22 現在はそのままの URL
	};

	viewer.getVideoUrlLargeMp4 = media => {

		const variantsMp4 = media['video_info']['variants'].filter(variant => variant['content_type'] === 'video/mp4');

		variantsMp4.sort((a, b) => b['bitrate'] - a['bitrate']);

		return variantsMp4[0]['url'];

	};

	viewer.getLocalMediaFileName = mediaUrl => {

		// TODO: 本当はこれだけでは不十分。URL の仕様上はクエリパラメータにスラッシュが含まれる可能性がある
		const baseName = mediaUrl.substring(mediaUrl.lastIndexOf('/') + 1);

		return viewer.percentEncode(baseName);

	};

	viewer.getProfileImageUrlOriginal = normal => normal.replace('_normal.', '.');

	// 
	// 
	// 
	/**
	 * RFC3986 仕様の encodeURIComponent
	 * 
	 * メモ: ここでは RFC3986 仕様である必要はないが、混乱を避けるため仕様を統一
	 */
	viewer.percentEncode = str =>
		encodeURIComponent(str).replace(/[!'()*]/g, char => '%' + char.charCodeAt().toString(16));

})();
