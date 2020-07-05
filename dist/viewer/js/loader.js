(() => {

	/**
	 * 疑似的な import
	 * 
	 * メモ: 相対パスは js からでなく html から見た相対パス
	 * メモ: 疑似 import している js では疑似 export も非同期にしなければならず、処理が複雑になるため、
	 *       疑似 export している js では疑似 import せず、疑似 export がない js で
	 *       依存関係のある js をまとめてインポートする
	 */
	window.importInNoModule = src => new Promise((resolve, reject) => {
		const s = document.createElement('script');
		s.async = true;
		s.onload = () => { resolve(); };
		s.onerror = () => { reject(); };
		s.src = src;
		document.head.append(s);
	});

	const importInNoModule = window.importInNoModule;

	// 
	const src = document.getElementById('loader').dataset.src;

	importInNoModule(src);

})();
