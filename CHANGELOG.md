# Changelog

## [Unreleased]
### Unadded
- 他のツイッター情報取得機能実装。
- ビューワの `tweets.html` で、返信・メディア・リツイートの表示・非表示機能追加。
- WEB 版 Twitter の日付検索と JavaScript によるブックマークレットを用いた、ツイート 3200 件問題の解決。
	- 非公開検索 API の代わり。
	- Twitter の仕様で、日付検索を用いても検索時に一部ツイートが表示されないことがあるため、完全な解決は不可能。
	- プレミアム公開 API を使用することで完全な回避が可能。ただし、プレミアム公開 API は月額料金。

### Unchanged
- ブックマークレットをもっと簡単に実行できるように。

### Unfixed
- ブックマークレットの取得抜けの改善 (可能なら) 。

## [0.1.0-alpha.6] - 2022-05-07
### Changed
- ドキュメントを全体的に修整。

## [0.1.0-alpha.5] - 2021-12-05
### Fixed
- 最新版の Deno に対応。

## [0.1.0-alpha.4] - 2021-09-16
### Fixed
- バグ修正と仕様変更対応のみ。

## [0.1.0-alpha.3] - 2020-07-06
### Added
- 新たに「ユーザーのツイート一括」を保存できるように。
	- ただし Twitter API の仕様上、新しい方から約 3200 件までしか取得できない。
	- そこから新たに追加されたツイートを差分として追加で取得することはできる (本ツールで合計は 3200 件以上保存可) 。
- 新たに「ブックマーク」を保存できるように。
	- PC 版 WEB 版 Twitter で、開発者ツールからブックマークレットを実行する想定。
	- 旧 PHP 版 [Twitter バックアップツール](https://github.com/kerupani129s/twitter-backup-tool)では日本語版 Twitter でないと取得できなかったのを、すべての言語で取得できるよう変更。
- ビューワの表示機能追加。

### Changed
- ローカルメディアファイルの処理を変更。
	- 「いいね」「フォロー」「フォロワー」「リスト」それぞれ再取得を行うとデータを引き継ぎます。

### Fixed
- いくつかの細かいバグ修正・変更。

## [0.1.0-alpha.2] - 2020-07-03
### Added
- 新たに「フォロー」「リスト全て」「リスト単体」を保存できるように。

### Changed
- ローカルに保存するメディアのファイル名の規則を変更。
	- 取得元 URL にクエリパラメータがあるときに拡張子を補う。
	- 古い Twitter のプロフィール画像のファイル名が、別ユーザーで重複するため、数字の ID を含めるように変更。
- v0.1.0-alpha.1 のデータの引継ぎに関して、ローカルのメディアファイル名の変更。
	- **※「いいね」に関しては、[`dist/favorites.js` の 77 行目](https://github.com/kerupani129s/twitter-backup-tool-deno/blob/v0.1.0-alpha.2/dist/favorites.js#L77) (※ `dist/viewer/` や `jsonp` でない) を一時的に `bothTweets` から `localTweets` 書き換えて、再取得を行ってください。ローカルのメディアファイル名が変更されます。取得後はソースコードを戻してください。**
	- 「フォロワー」に関しては、再取得を行うと自動でローカルのメディアファイル名が変更されます。
	- **※一部のメディアファイル名が変更されずに再ダウンロードされることがあります。削除済みツイート・ユーザーなどで再ダウンロードが不可な場合、必要に応じて保存済みのメディアのファイル名を手動で変更してください。**
- Twitter API の通信でエラーが発生した場合は終了するように。
- メディアダウンロードの通信でエラーが発生した場合はスキップして続行するように。

## [0.1.0-alpha.1] - 2020-06-26
### Added
- 「フォロワー」ユーザーを保存できるように。

### Changed
- v0.1.0-alpha.0 で「いいね」の JSONP のメンバ名を `tweets` にしていたのを、`favorites` に変更。
	- **※ v0.1.0-alpha.0 のダウンロードデータの JSONP を引き継ぐには、手動で JSONP の書き換えが必要。**
	- 書き換えを行わずに取得すると、過去に取得した後にリモートで削除されたツイートがローカルから削除されます。

## [0.1.0-alpha.0] - 2020-06-21
### Added
- とりあえず「いいね」ツイートを保存できるように。

### Changed
- 旧 PHP 版 [Twitter バックアップツール](https://github.com/kerupani129s/twitter-backup-tool)から移植。
	- php と wget で行っていた処理を全て js に統一。
	- データの保存処理と HTML による表示処理が混合していたのを分離。
	- 常に取得時のデータを全てダウンロードしていたのを、追加された差分だけ取得するよう変更。
	- 削除されたツイート・ユーザーはそのままローカルに残すよう変更。

[Unreleased]: https://github.com/kerupani129s/twitter-backup-tool-deno/compare/v0.1.0-alpha.6...HEAD
[0.1.0-alpha.6]: https://github.com/kerupani129s/twitter-backup-tool-deno/compare/v0.1.0-alpha.5...v0.1.0-alpha.6
[0.1.0-alpha.5]: https://github.com/kerupani129s/twitter-backup-tool-deno/compare/v0.1.0-alpha.4...v0.1.0-alpha.5
[0.1.0-alpha.4]: https://github.com/kerupani129s/twitter-backup-tool-deno/compare/v0.1.0-alpha.3...v0.1.0-alpha.4
[0.1.0-alpha.3]: https://github.com/kerupani129s/twitter-backup-tool-deno/compare/v0.1.0-alpha.2...v0.1.0-alpha.3
[0.1.0-alpha.2]: https://github.com/kerupani129s/twitter-backup-tool-deno/compare/v0.1.0-alpha.1...v0.1.0-alpha.2
[0.1.0-alpha.1]: https://github.com/kerupani129s/twitter-backup-tool-deno/compare/v0.1.0-alpha.0...v0.1.0-alpha.1
[0.1.0-alpha.0]: https://github.com/kerupani129s/twitter-backup-tool-deno/releases/tag/v0.1.0-alpha.0
