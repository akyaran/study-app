# ページ復習アプリ

写真で撮ったプリント画像を、1枚ずつ「問題 → 解答確認」の単位として扱う復習アプリです。

## 考え方

- 1枚の写真を1回分の問題セットとして出します。
- 解答は別の紙などに書きます。
- 解答確認画面で、小問ごとに `正解` / `不正解` を自分でマークします。
- 不正解が多い小問は、復習優先モードでそのページが出たときに `今回やる小問` として表示されます。
- 学習記録はブラウザのローカル保存に入ります。

## データ形式

`pages-data.js` にページ単位で定義します。

```js
window.PAGE_REVIEW_DATA = {
  categories: [{ id: "math-division", label: "算数（割り算）" }],
  pages: [
    {
      id: "division-page15",
      category: "math-division",
      title: "割り算 ページ15",
      source: "2026-05-22 18-36 ページ 15.JPEG",
      image: "images/division-page15.jpeg",
      subitems: [
        { id: "q1", label: "1", title: "計算とたしかめ", answer: "..." }
      ]
    }
  ]
};
```

画像はBase64化せず、JPEG/PNGのバイナリファイルとして `images/` に配置します。
