# 勉強アプリ

iPadでも使いやすい、シンプルな自習用アプリです。問題を見て紙などに解答し、アプリ内で解答と解説を確認します。

## 使い方

1. `index.html` をブラウザで開きます。
2. 右上の「読み込み」から `questions.json` を選ぶと、問題集を差し替えられます。
3. 「ヒント」「解答へ」「解説」を使って学習します。

GitHub Pagesなどで公開する場合は、`index.html`, `styles.css`, `app.js`, `questions.json`, `questions-data.js`, `images/` を同じ場所に置きます。

## 画像ファイルの扱い

画像はBase64化、Markdown添付URL化、SVG化、WebP化、再生成をせず、JPEGまたはPNGのバイナリファイルとして `images/` に置きます。アプリとREADMEからは相対パスで参照します。

例:

![45 ÷ 6 の筆算問題](images/page9-division-45-6.jpg)

![64 ÷ 8 の筆算問題](images/page9-division-64-8.jpg)

## 問題データ

問題データの作り方は `DATA_FORMAT.md` を見てください。問題、ヒント、解答、解説はテキストでも画像でも表示できます。
