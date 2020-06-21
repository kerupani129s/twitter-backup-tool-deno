# Twitter バックアップツール (Deno 版)

Twitter のユーザーやツイートのバックアップを手助けするツールです。

もともと自分用なため、注意事項を読んでからご使用ください。

bash と deno と Twitter API を使えることを前提としています。

## 1. 本ツールで保存できるもの

現時点では以下のものに対応しています。今後追加予定です。

※ `<ログイン>`: 本ツールから Twitter にログインするのに使用する識別子。

- ツイート取得 (主に自身の)
	- いいね
		- `favorites.js <ログイン> <@ユーザー名>`

## 2. 使い方

### 2.1. 必要なもの

- bash
- deno
- Twitter API
- WEB ブラウザ (閲覧用)

### 2.2. Twitter API と連携

Twitter API の取得と連携は各自でお願いします。

API 用のキー 2 つとユーザー用のトークン 2 つを、本ツールの設定ファイル `dist/downloads/config.json` を作成して追加します。

以下の例では、`username_main` や `username_sub` が `<ログイン>` に相当します (@ユーザー名である必要はないですが、@ユーザー名と同じにした方が分かりやすいと思います) 。

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

### 2.3. deno で js を実行

`dist/` ディレクトリ内で `./deno-run.sh <js> [<引数>]` を実行します。

ツイッターの情報と、画像・動画ファイルがダウンロードされます、

例：

```
./deno-run.sh favorites.js username username
```

## 3. 注意事項

- 全般
	- 使用は自己責任でお願いします。
	- ログインユーザーを間違えると、非公開ツイートなどが正しく取得できないことがあります。
	- 自分用にローカルで動作させることを想定しているため、js のセキリティの対策 (引数チェック) はしていません。WEB 上に公開する際にはセキリティの対策をお願いします。
	- 同様の理由で、通信エラーやパース時のエラーなどもチェックしていません。必要に応じて追記してください。
	- ある程度テストしていますが完全ではないため、予期せぬバグを含んでいる可能性があります。
	- ツイートに関して、テキスト、画像、動画、GIF は対応していますが、投票は対応していません。

## 4. ライセンス

[MIT License](LICENSE)

## 5. バージョン履歴

- 2020/06/21 ver.2.0-pre-alpha.0
	- とりあえず「いいね」ツイートを保存できるように。
	- ver.1.0 で php と wget で行っていた処理を全て js に統一・移植。
	- ver.1.0 で表示処理と保存処理が混合していたのを分離。
	- ver.1.0 では常に取得時のツイッターの情報をそのままダウンロードしていたのを、ver.2.0 で追加分だけ取得するよう変更。
		- 削除されたツイート・ユーザーはそのままローカルに残すように。

## 6. 今後の予定

- 他のツイッター情報取得機能実装。
- WEB 版 Twitter の日付検索と JavaScript によるブックマークレットを用いた、ツイート 3200 件問題の解決。
	- 実質、非公開検索 API を用いて取得するのと同意義。非公開 API を直接使用するよりこちらの方が大丈夫そう (？) 。
	- 日付検索を用いても、完全な解決は不可能 (Twitter の仕様で、検索時に一部ツイートが表示されないことがある) 。
	- プレミアム公開 API を使用することで完全な回避が可能。ただし、月額料金。
