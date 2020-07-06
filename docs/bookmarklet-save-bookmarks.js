// 
// メモ: 画面を一番下までスクロールしてから以下を実行
// 

// tweets[]

(() => {
	const a = document.createElement('a');
	a.href = 'data:application/json,' + encodeURIComponent(JSON.stringify(tweets, null, 4));
	a.download = 'bookmarks.json';
	a.click();
})();
