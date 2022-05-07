# 使い方

## 1. Twitter API の設定と連携

Twitter API キーの取得と連携は各自でお願いします。

API 用のキー 2 つとユーザー用のトークン 2 つを、本ツールの設定ファイル `dist/downloads/config.json` を作成して追加します。

以下の例では、`username_main` や `username_sub` が `<ログイン名>` に相当します (`@ユーザー名` である必要はないですが、`@ユーザー名` と同じにした方が分かりやすいと思います) 。

```json
{
	"api_key"       : "XXXXXXXXXXXXXXXXXXXXXXXXX",
	"api_secret_key": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
	"profiles": {
		"username_main": {
			"access_token"       : "000000000000000000-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
			"access_token_secret": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
		},
		"username_sub": {
			"access_token"       : "0000000000000000000-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
			"access_token_secret": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
		}
	}
}
```

本ツールの現バージョンではアプリ連携の機能がありません。  
API 用の Twitter アカウントでは API の設定画面からアクセストークンとアクセストークンシークレットを生成できます。  
API 用の Twitter アカウント以外では以下のページ等を参考にアクセストークンとアクセストークンシークレットを取得してください。

参考「[Twurl で連携アプリ認証し、アクセストークンとシークレットを取得 - Qiita](https://qiita.com/kerupani129/items/8a144d3c152b4f4708a9)」

## 2. ブックマークレット実行 (「ブックマーク」等のみ)

ブックマークレット:

- 「[ツイート ID 取り込み開始ブックマークレット]」
- 「[ツイート ID 取り込み終了ブックマークレット]」

1. WEB 版 Twitter を WEB ブラウザで開き、開発者ツールのコンソール画面を開いて JavaScript を実行できる状態にする。
1. 「ブックマーク」等のページの一番上の状態で、「[ツイート ID 取り込み開始ブックマークレット]」を実行する。
1. 少しずつゆっくりとページを一番下までスクロールしていく。
	- ※スクロールが早いと取得抜けが起きることがあります。
	- マウスの中クリック等で自動スクロールするのも可。
1. ページ一番下まで来たら「[ツイート ID 取り込み終了ブックマークレット]」を実行する。
1. JSON 形式でツイート ID 一覧が保存される。
1. `dist/downloads/<対象ユーザー>/json/` ディレクトリ (ない場合は新規作成) に JSON ファイルを移動する。
	- ブックマークはファイル名を `bookmarks.json` にする。

[ツイート ID 取り込み開始ブックマークレット]: ../bookmarklet-observe.js
[ツイート ID 取り込み終了ブックマークレット]: ../bookmarklet-save-bookmarks.js

例:

```
dist/downloads/username/json/bookmarks.json
```

※本ツールの現バージョンでは、ブックマークレットによって取得したツイートは後の作業で「ブックマーク」しか保存を完了できませんが、「ブックマーク」でないものでも「ブックマーク」として取得することにより、「モーメント」やユーザーのメディアツイート等の保存用に代用することができます。

## 3. Deno で js を実行

※ `<ログイン名>`: 本ツールから Twitter にログインするのに使用する識別子です。  
※ `<@対象ユーザー名>`: 保存したい対象の `@ユーザー名` の `ユーザー名` の部分を `@` なしで指定してください。  
※ `<対象リスト ID>`: WEB ブラウザ上で公式 Twitter を表示した際に、URL に含まれる数字の文字列です。

- ツイート取得
	- ユーザーのツイート 一括 (※取得時の追加分のツイートに関して最大約 3200 件まで取得可)
		- `tweets-3200.js <ログイン名> <@対象ユーザー名>`
	- いいね
		- `favorites.js <ログイン名> <@対象ユーザー名>`
	- ブックマーク (※別途、ブックマークレットによるツイート ID 取得が必要)
		- `bookmarks.js <ログイン名> <@対象ユーザー名>`
- ユーザー取得
	- フォロワー
		- `followers.js <ログイン名> <@対象ユーザー名>`
	- フォロー中
		- `following.js <ログイン名> <@対象ユーザー名>`
	- リスト
		- 一括: `lists.js <ログイン名> <@対象ユーザー名>`
		- 単体: `list.js <ログイン名> <対象リスト ID>`

`dist/` ディレクトリ内で `./deno-run.sh <js> <ログイン名> [<引数>]` を実行します。

ツイッターの情報と、画像・動画ファイルが `dist/downloads/<対象ユーザー>/` ディレクトリにダウンロードされます、

メディアファイルのダウンロード中に NetworkError が発生した場合、処理終了後に再取得を行うとダウンロードできることがあります。  
(再取得してもダウンロードできない場合もあります。)

例:

```sh
./deno-run.sh favorites.js username username
```

## 4. WEB ブラウザで閲覧

専用の html ファイルを開くと保存したツイートやユーザーが表示されます。

例:

```
dist/downloads/username/favorites.html
```
