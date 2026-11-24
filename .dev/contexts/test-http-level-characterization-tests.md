# test/http-level-characterization-tests 対話コンテキスト

- PR: #1582
- Branch: `test/http-level-characterization-tests`
- Source commit: 23510199eea
- Updated at: 2026-08-23 13:05:00

## 目的

`@kintone/rest-api-client` は axios → fetch(undici) への移行が計画されている（[kintone/js-sdk#3937](https://github.com/kintone/js-sdk/pull/3937)）。cli-kintone は現状 axios ベースのこのクライアントに依存しており、移行後も挙動が変わらないことを検証できる自動テストが存在しなかった。このブランチは、axios ベースの現在の挙動を先に「特性化テスト（characterization tests）」として固定する。

## 設計方針

- msw ではなく `node:http` の生ソケットで実サーバーを立てる（`HttpTestServer`）。msw は axios と fetch を別々のコード経路でインターセプトするため、msw ベースの検証では2つのインターセプタ実装を比較するだけになり、js-sdk 側に既に存在する msw ベースのハーネスと重複するだけになると判断した。
- `HttpTestServer` は1テストファイルにつき1インスタンス（`beforeAll`で起動、`beforeEach`で`reset()`）。
- レスポンスボディを送る手段を `body`（常にJSON.stringifyされる）と `rawBody`（文字列/Bufferをそのまま送る）の2種類に分離した。当初 `body` のみだったが、sanity-review で「文字列を`body`に渡しても`JSON.stringify`で引用符付きの妥当なJSON文字列になり、意図した『非JSONボディ』を検証できていない」というテストの信頼性バグが発覚し、修正した。
- リスク領域の選定はjs-sdk側の実際の修正コミットを手がかりにした: `deleteAllRecords`/ファイルアップロード(multipart/stream)は `bd0eb710`、プロキシ検証は `0309c872`（httpsAgent回帰）を狙い撃ちしている。

## 却下した代替案

- **fetch版rest-api-clientをtarball化してoverrideで実差し替え検証する（Tier 0）**: ローカルの js-sdk（`/Users/t003557/work/js-sdk`、ブランチ `fix/undici-dispatcher-version-mismatch`）でビルド・`pnpm pack`まで済ませたが、`package.json`の書き換えをユーザーが明示的に却下した（「そこまではしなくていい」）。理由の詳細な説明はなし。tarball自体は `/tmp/kintone-rest-api-client-6.2.1.tgz` に残っている（セッション終了で消える可能性あり、再現するには js-sdk 側で `pnpm --filter @kintone/rest-api-client build && pnpm pack --pack-destination /tmp` を再実行すればよい）。
- **`HttpTestServer`の`listen()`を`127.0.0.1`にバインドする**: sanity-reviewで「決定性の観点で`localhost`より`127.0.0.1`が良い」と指摘されたが、`KintoneRestAPIClient`の`validateBaseUrl`が「hostnameが`localhost`以外なら`https`必須」という制約を持つため、`127.0.0.1`にすると全テストがコンストラクタで即エラーになる。この制約は axios版・fetch版（js-sdk側でビルドしたもの）の両方で同一であることを確認済みで、`localhost`のまま維持する判断をした。

## 意図的に対応しないこと

- クライアント証明書（pfx）の検証: 自己署名証明書での実TLSハンドシェイクと、プロセス起動時に設定する必要がある`NODE_EXTRA_CA_CERTS`が必要（テストファイル内からは設定不可）。別のvitestプロジェクト設定が要る。
- レコードエクスポートのカーソルページング（`/k/v1/records/cursor.json`）: cli-kintoneで最も呼び出し頻度が高い経路の一つだが未着手。
- リダイレクト時のボディ再送（307/308）: 未着手。
- fetch版への実差し替え検証（Tier 0/1）: 上記の通りユーザーの意向でスコープ外。

## 発見された制約

- `KintoneRestAPIClient`（6.2.1）の`validateBaseUrl`は `url.hostname !== "localhost" && url.protocol !== "https:"` の場合にthrowする。つまり平文httpが許されるのは hostname が厳密に `"localhost"` の場合のみ（`127.0.0.1`はNG）。これはjs-sdk側でfetch移行後にビルドしたバージョンでも同一のロジックであることを確認済み（`packages/rest-api-client/src/KintoneRestAPIClient.ts`のvalidateBaseUrl相当）。
- cli-kintoneのe2e（cucumber）は `bin/cli-kintone-<platform>`（`ncc build` → `pkg --sea`）のビルド済みバイナリを子プロセスとして実行する方式で、実kintone環境の認証情報（`.e2e-credentials.json`）が必要。この開発環境には認証情報が無く、e2eはフル実行できない。
- cli-kintoneの`engines.node`は`>=20`だが、js-sdk側のrest-api-clientはfetch移行に伴い`>=22`に引き上げ済み。サポートポリシー上の判断が別途必要（今回のテスト整備のブロッカーにはしていない）。
- `src/kintone/client.ts`の`buildRestAPIClient`は、proxy/pfxいずれも未指定の場合でも常に`httpsAgent: new https.Agent({})`を明示的に構築して`KintoneRestAPIClient`に渡している。これはjs-sdk側の`0309c872`（TLSオプションなしのhttpsAgentが渡された場合の回帰）に直接該当するリスク領域。

## 新たに確認できた事実

- cli-kintoneの既存ユニットテストは`KintoneRestAPIClient`の各メソッド（`record.deleteAllRecords`等）を`vi.fn()`で直接差し替えており、HTTP層を一切経由しない。そのためrest-api-client内部の実装がaxiosからfetchに変わっても既存テストは何も検知できない。
- `deleteAllRecords`は内部で `GET /k/v1/records.json` → `POST /k/v1/bulkRequest.json`（`DELETE /k/v1/records.json`をbulk request化）という2段のリクエストを送る。`addAllRecords`も同様に`POST /k/v1/bulkRequest.json`にラップされ、レスポンス形式は`{"results": [{"ids": [...], "revisions": [...]}]}`。
- ファイルアップロード（`apiClient.file.uploadFile`）は`multipart/form-data`で`POST /k/v1/file.json`に送信される。
- axios版でのエラー分類: kintoneのJSON形式500エラー → `KintoneRestAPIError`（status/code/id保持）。ソケット破棄によるトランスポート断 → `AxiosError`（`code: ECONNRESET`, `message: "socket hang up"`）、`KintoneRestAPIError`のinstanceにはならない。502+非JSON(HTML)ボディ → プレーンな`Error`（`message: "502: Bad Gateway"`）、これも`KintoneRestAPIError`にはならない。

## 注意が必要な難所

- `HttpTestServer`で文字列/Bufferの生ボディを送りたい場合は`body`ではなく`rawBody`を使うこと。`body`は常に`JSON.stringify`されるため、文字列を渡しても意図せず「有効なJSON文字列」になってしまい、「非JSONボディ」のテストにならない（このブランチで一度踏んだ）。
- multipartのテスト用フィクスチャで単調増加バイト列（`i % 256`）を使うと、CRLFやboundary類似バイト（`--`）を一切含まないため、multipartパーサーが実運用で踏みうるエッジケース（バイナリ内にCRLFやboundary類似列が紛れ込むケース）を意図せず回避してしまう。`seededPseudoRandomBytes`のように、決定的だがCRLF/`--`を意図的に混ぜ込む生成方法にすること。
- fetch/undici移行後はNodeのkeep-aliveが既定で有効になるため、`HttpTestServer.close()`／`ConnectProxyServer.close()`は`closeAllConnections()`を呼んでから`server.close()`する必要がある。呼ばないと、移行後に`afterAll`がkeepAliveTimeout（既定5秒）待ちで詰まりうる。

## 残作業

- fetch版のrest-api-client（js-sdk側、`/Users/t003557/work/js-sdk`のブランチ`fix/undici-dispatcher-version-mismatch`でビルド・pack済み）を実際に差し込んで、この5ファイルのHTTPレベルテストがgreenのまま残るか検証する（未実施、ユーザーの意向で今回はスコープ外）。
- 上記を実施した場合、`buildRestAPIClient proxy support`のCONNECTテストはjs-sdk側がundiciのdispatcherベースに移行した影響で`HttpsProxyAgent`（`https.Agent`のサブクラス）がそのまま機能しない可能性が高く、redになると予想している。redになった場合はcli-kintone側のバグではなくjs-sdk側へのフィードバック事項として扱う。
- カーソルページング、リダイレクト再送（307/308）、クライアント証明書（pfx）検証のテストは未着手。