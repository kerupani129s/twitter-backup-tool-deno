(() => {

	window.viewer = window.viewer || {};

	const viewer = window.viewer;

	/**
	 * 文字列に含まれるエンティティ (URL・ユーザー・ハッシュタグ・キャッシュタグ) をリンクに置換
	 */
	viewer.replaceEntitiesToLinks = (text, entities, displayTextRange = null) => {

		// メモ: 絵文字などに含まれるサロゲートペアで文字数が正しく扱えないことがあるため、文字列配列に変換。
		//       元のテキストは文字単位に分割し、置換時は処理の簡単のため文字列に置換。
		const textArray = [...text];

		let replacements = [];

		// 
		if ( 'urls' in entities ) {
			entities['urls'].forEach(entity => {
				replacements.push({
					indices: entity['indices'],
					replacement: '<a href="' + entity['expanded_url'] + '">' + entity['display_url'] + '</a>'
				});
			});
		}

		if ( 'user_mentions' in entities ) {
			entities['user_mentions'].forEach(entity => {
				replacements.push({
					indices: entity['indices'],
					replacement: '<a href="https://twitter.com/' + entity['screen_name'] + '">@' + entity['screen_name'] + '</a>'
				});
			});
		}

		if ( 'hashtags' in entities ) {
			entities['hashtags'].forEach(entity => {
				replacements.push({
					indices: entity['indices'],
					replacement: '<a href="https://twitter.com/hashtag/' + entity['text'] + '">#' + entity['text'] + '</a>'
				});
			});
		}

		if ( 'symbols' in entities ) {
			entities['symbols'].forEach(entity => {
				replacements.push({
					indices: entity['indices'],
					replacement: '<a href="https://twitter.com/search?q=%24' + entity['text'] + '">$' + entity['text'] + '</a>'
				});
			});
		}

		if ( 'media' in entities ) {
			entities['media'].forEach(entity => {
				replacements.push({
					indices: entity['indices'],
					replacement: '<a href="' + entity['expanded_url'] + '">' + entity['display_url'] + '</a>'
				});
			});
		}

		// 
		if ( displayTextRange ) {

			replacements = replacements.filter(replacement =>
					displayTextRange[0] <= replacement['indices'][0] && replacement['indices'][1] <= displayTextRange[1]
					);

			replacements.push({ indices: [0, displayTextRange[0]], replacement: '' });
			replacements.push({ indices: [displayTextRange[1], textArray.length], replacement: '' });

		}

		// 後ろから順に置換
		// 
		// メモ: 後ろからでないと位置がズレる
		replacements.sort((a, b) => b['indices'][0] - a['indices'][0]);

		// メモ: 置換時は処理の簡単のため文字列に置換。
		replacements.forEach(replacement => {
			textArray.splice(replacement['indices'][0], replacement['indices'][1] - replacement['indices'][0], replacement['replacement']);
		});

		return textArray.join('');

	};

	/**
	 * 改行コードを <br> に変換
	 */
	viewer.nl2br = str => str.replace(/\r\n/g, '<br>').replace(/\n|\r/g, '<br>');

})();
