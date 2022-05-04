# Twitter バックアップツール (Deno 版)

Twitter のユーザーやツイートのバックアップを手助けするツールです。

テキストデータだけでなく、プロフィール画像やツイートに含まれる画像、動画、GIF (外部サイトのリンクは除く) も保存します。

もともと自分用なため、注意事項を読んでからご使用ください。

bash と deno と Twitter API を使えることを前提としています。

## 1. 本ツールで保存できるもの

現時点では以下のものに対応しています。今後追加予定です。

※ `<ログイン名>`: 本ツールから Twitter にログインするのに使用する識別子です。  
※ `<@対象ユーザー名>`: 保存したい対象の `@ユーザー名` の `ユーザー名` の部分を `@` なしで指定してください。  
※ `<対象リスト ID>`: WEB ブラウザ上で公式 Twitter を表示した際に、URL に含まれる数字の文字列です。

- ツイート取得 (主に他人の)
	- ユーザーのツイート
		- 一括: `tweets-3200.js <ログイン名> <@対象ユーザー名>` (※最大約 3200 件まで取得可)
- ツイート取得 (主に自身の)
	- いいね
		- `favorites.js <ログイン名> <@対象ユーザー名>`
	- ブックマーク
		- `bookmarks.js <ログイン名> <@対象ユーザー名>` (※別途、JSON 形式のファイル取得が必要)
- ユーザー取得 (主に自身の)
	- フォロワー
		- `followers.js <ログイン名> <@対象ユーザー名>`
	- フォロー中
		- `following.js <ログイン名> <@対象ユーザー名>`
	- リスト
		- 全て: `lists.js <ログイン名> <@対象ユーザー名>`
		- 単体: `list.js <ログイン名> <対象リスト ID>`

## 2. 使い方

### 2.1. 必要なもの

- bash
- deno
- Twitter API
- WEB ブラウザ (閲覧用、ブックマークレット実行用)

### 2.2. Twitter API と連携

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

### 2.3. ブックマークレット実行 (ブックマークまたはモーメントのみ)

ブックマークレット

- [「ツイート取り込み開始ブックマークレット」(ブックマーク用)](docs/bookmarklet-observe.js)
- [「ツイート取り込み終了ブックマークレット」(ブックマーク用)](docs/bookmarklet-save-bookmarks.js)

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

### 2.4. deno で js を実行

`dist/` ディレクトリ内で `./deno-run.sh <js> <ログイン名> [<引数>]` を実行します。

ツイッターの情報と、画像・動画ファイルが `dist/downloads/<対象ユーザー>/` ディレクトリにダウンロードされます、

メディアファイルのダウンロード中に NetworkError が発生した場合、処理完了後に再取得を行うとダウンロードできることがあります。  
(再取得してもダウンロードできない可能性もあります。)

例：

```
./deno-run.sh favorites.js username username
```

### 2.5. WEB ブラウザで閲覧

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

## 3. 注意事項

- 全般
	- 使用は自己責任でお願いします。
	- ログインユーザーを間違えると、非公開ツイートなどが正しく取得できないことがあります。
	- 自分用にローカルで動作させることを想定しているため、js のセキリティの対策 (引数チェック) はしていません。WEB 上に公開する際にはセキリティの対策をお願いします。
	- 同様の理由で、通信エラーやパース時のエラーなどもあまりチェックしていません。必要に応じて追記してください。
	- ある程度テストしていますが完全ではないため、予期せぬバグを含んでいる可能性があります。
	- ツイートに関して、テキスト、画像、動画、GIF は対応していますが、投票は対応していません。
		- 外部リンクによる画像、動画は保存されません。
		- GIF は Twitter によって動画ファイル化されるため、動画ファイルとして保存します。
	- プロフィール画像も保存します。再取得時に最新のものに更新するものと更新しないものがあります。
		- ツイートをまとめて取得するとき、過去に取得したツイートのプロフィール画像は更新されません。
		- ユーザーをまとめて取得するとき、リモートに存在するユーザー全てのプロフィール画像を更新します。
- ユーザーツイート一覧に関して
	- Twitter API の仕様上、最大約 3200 件までとなっています。
	- WEB 版 Twitter の日付検索と、ブックマーク用のブックマークレットを使用することで、ある程度回避できる可能性があります。
	- メディアツイート一覧の画面で約 800 件までメディアツイートをさかのぼれるようです。ブックマーク用のブックマークレットを使用することで取得できます。
- ブックマークに関して
	- ブックマークは Twitter の公開 API で取得することができないため、JavaScript によるブックマークレットを用いて取得します。
	- ゆっくりスクロールしないと取得抜けが起きることがあります。
	- DOM の解析が雑なため、Twitter が仕様変更すると使えなくなる可能性があります。
	- WEB 版 Twitter では Content-Security-Policy が設定されているため、許可されていないドメインの外部 JavaScript を実行するブックマークレットは実行できません。


## 4. ライセンス

[MIT License](LICENSE)

## 5. 変更履歴と今後の予定

[Changelog](CHANGELOG.md)

※ pre-alpha バージョンは仕様変更が多いため、データの引継ぎは 1 バージョンずつ行って下さい。
