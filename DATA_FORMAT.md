# 勉強アプリ データ形式

問題データは `questions.json` に入れます。AIで問題集を読み取らせるときは、この形式のJSONで出力するよう指定してください。

## AIへの指定文例

以下の問題集から、勉強アプリ用のJSONを作ってください。

- 出力はJSONのみ
- ルートは `title`, `description`, `categories`, `questions`
- `categories` は `{ "id": "math-division", "label": "算数（割り算）" }` の配列にする
- `questions` は配列
- 各問題には `id`, `title`, `subject`, `category`, `prompt`, `hints`, `answer`, `explanation` を入れる
- 各問題の `category` はカテゴリIDを1つ指定する。例: `"category": "math-division"`
- `prompt`, `hints`, `answer`, `explanation` は、表示ブロックの配列にする
- テキストは `{ "type": "text", "value": "..." }`
- 数式や筆算は `{ "type": "math", "value": "..." }`
- わり算の筆算は、崩れやすいので次の専用形式を使う
  `{ "type": "division", "expression": "45 ÷ 6 = 7 あまり 3", "divisor": "6", "dividend": "45", "quotient": "7", "product": "42", "remainder": "3", "notes": ["42 ... □ × □", "3 ... □ - □"] }`
- 元画像の配置をそのまま見せたい筆算、図、表は、切り抜き画像にして `{ "type": "image", "src": "images/ファイル名.jpg", "alt": "画像の説明" }` を使う
- 画像は PNG/JPEG のまま置けます。例: `{ "type": "image", "src": "images/ファイル名.jpg", "alt": "画像の説明" }`
- 問題文や解答を画像のまま使う場合は `type: "image"` を使う
- ヒントが不要なら `hints` は空配列にする
- 解説が不要なら `explanation` は空配列にする
- 答え合わせ機能は不要なので、選択肢や正誤判定用データは作らない

カテゴリは、教科や分野ごとの「アプリ切り替え」のように使います。問題読み込み時にカテゴリを指定すると、そのカテゴリ内の問題として出題・集計されます。標準カテゴリは次の通りです。

```json
[
  { "id": "math", "label": "算数" },
  { "id": "math-division", "label": "算数（割り算）" },
  { "id": "math-angles", "label": "算数（角度）" },
  { "id": "math-fractions", "label": "算数（分数）" },
  { "id": "math-decimals", "label": "算数（小数）" },
  { "id": "japanese", "label": "国語" },
  { "id": "science", "label": "理科" },
  { "id": "social-studies", "label": "社会" },
  { "id": "english", "label": "英語" },
  { "id": "review", "label": "復習" }
]
```

## 最小例

```json
{
  "title": "算数ドリル",
  "description": "分数の練習",
  "categories": [
    { "id": "math-fractions", "label": "算数（分数）" },
    { "id": "review", "label": "復習" }
  ],
  "questions": [
    {
      "id": "q001",
      "title": "分数のたし算",
      "subject": "算数",
      "category": "math-fractions",
      "prompt": [
        { "type": "text", "value": "次の計算をしなさい。" },
        { "type": "math", "value": "1/3 + 1/6 = ?" }
      ],
      "hints": [
        { "type": "text", "value": "分母を6にそろえます。" }
      ],
      "answer": [
        { "type": "text", "value": "1/2" }
      ],
      "explanation": [
        { "type": "text", "value": "1/3 = 2/6 なので、2/6 + 1/6 = 3/6 = 1/2です。" }
      ]
    }
  ]
}
```

## 画像を使う例

画像は `images` フォルダに置き、`src` に相対パスを書きます。

```json
{
  "type": "image",
  "src": "images/page-001-question.png",
  "alt": "問題1の画像"
}
```

問題文、ヒント、解答、解説のどこでも画像ブロックを使えます。テキストブロックと画像ブロックを混ぜることもできます。
