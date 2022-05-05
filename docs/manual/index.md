# 使い方

## 1. Twitter API と連携

Twitter API の取得と連携は各自でお願いします。

API 用のキー 2 つとユーザー用のトークン 2 つを、本ツールの設定ファイル `dist/downloads/config.json` を作成して追加します。

以下の例では、`username_main` や `username_sub` が `<ログイン名>` に相当します (@ユーザー名である必要はないですが、@ユーザー名と同じにした方が分かりやすいと思います) 。

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

アプリ連携用のソースコードを書かずに、サブアカウントでアクセストークンとアクセストークンシークレットを取得したい場合は、以下のページを参考にしてください。

参考「[Twurl で連携アプリ認証し、アクセストークンとシークレットを取得 - Qiita](https://qiita.com/kerupani129/items/8a144d3c152b4f4708a9)」

## 2. ブックマークレット実行 (ブックマークまたはモーメントのみ)

ブックマークレット

- [「ツイート取り込み開始ブックマークレット」(ブックマーク用)](../bookmarklet-observe.js)
- [「ツイート取り込み終了ブックマークレット」(ブックマーク用)](../bookmarklet-save-bookmarks.js)

1. WEB 版 Twitter をブラウザで開き、開発者ツールのコンソール画面を開いて JavaScript を実行できる状態にする。
2. ブックマークのページの一番上の状態で、上記の「ツイート取り込み開始ブックマークレット」を実行する。
3. 少しずつゆっくりとページを一番下までスクロールしていく。
	- ※スクロールが早いと取得抜けが起きることがあります。
4. ページ一番下まで来たら、上記の「ツイート取り込み終了ブックマークレット」を実行する。
5. JSON 形式でツイート ID 一覧が保存される。
6. `dist/downloads/<対象ユーザー>/json/` ディレクトリ (ない場合は作成) に JSON ファイルを移動する。
	- ブックマークはファイル名を `bookmarks.json` にする。

例：

```
dist/downloads/username/json/bookmarks.json
```

## 3. deno で js を実行

`dist/` ディレクトリ内で `./deno-run.sh <js> <ログイン名> [<引数>]` を実行します。

ツイッターの情報と、画像・動画ファイルが `dist/downloads/<対象ユーザー>/` ディレクトリにダウンロードされます、

メディアファイルのダウンロード中に NetworkError が発生した場合、処理完了後に再取得を行うとダウンロードできることがあります。  
(再取得してもダウンロードできない可能性もあります。)

例：

```sh
./deno-run.sh favorites.js username username
```

## 4. WEB ブラウザで閲覧

専用の html ファイルを開くと、保存したツイートが表示されます。

動作環境：

- Chrome
- Firefox
- Edge

※ IE では表示できません。

例：

```
dist/downloads/username/favorites.html
```
