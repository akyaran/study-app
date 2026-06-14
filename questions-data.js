window.DEFAULT_DECK = {
  "title": "小学4年生 算数 わり算の筆算",
  "description": "問題集の写真から作成した、わり算の筆算・あまり・たしかめ算の練習問題です。",
  "questions": [
    {
      "id": "import-page9-q001",
      "title": "筆算のあなうめ 45 ÷ 6",
      "subject": "算数・わり算の筆算",
      "source": "2026-05-22 18-36 ページ 9.JPEG",
      "prompt": [
        { "type": "text", "value": "わり算の筆算をしました。□にあてはまる数を書きましょう。" },
        {
          "type": "image",
          "src": "images/page9-division-45-6.jpg",
          "alt": "45 ÷ 6 の筆算と、42は□×□、3は□-□で表す穴埋め問題",
          "caption": "元の問題集画像から切り出した筆算です。"
        }
      ],
      "hints": [
        { "type": "text", "value": "まず、42が何を表しているか考えます。" },
        { "type": "math", "value": "42 = 6 × 7" },
        { "type": "text", "value": "あまりの3は、45から42をひいて出します。" }
      ],
      "answer": [
        { "type": "math", "value": "42 ... 6 × 7\n3  ... 45 - 42" }
      ],
      "explanation": [
        { "type": "text", "value": "筆算で下に書く42は、割る数6と商7をかけた数です。" },
        { "type": "math", "value": "6 × 7 = 42" },
        { "type": "text", "value": "あまりは、割られる数45から42をひいて求めます。" },
        { "type": "math", "value": "45 - 42 = 3" }
      ]
    },
    {
      "id": "import-page9-q002",
      "title": "筆算のあなうめ 64 ÷ 8",
      "subject": "算数・わり算の筆算",
      "source": "2026-05-22 18-36 ページ 9.JPEG",
      "prompt": [
        { "type": "text", "value": "わり算の筆算をしました。□にあてはまる数を書きましょう。" },
        {
          "type": "image",
          "src": "images/page9-division-64-8.jpg",
          "alt": "64 ÷ 8 の筆算と、64は□×□、0は□-□で表す穴埋め問題",
          "caption": "元の問題集画像から切り出した筆算です。"
        }
      ],
      "hints": [
        { "type": "text", "value": "64は、割る数8と商8をかけた数です。" },
        { "type": "math", "value": "8 × 8 = 64" },
        { "type": "text", "value": "あまり0は、64から64をひいて出ます。" }
      ],
      "answer": [
        { "type": "math", "value": "64 ... 8 × 8\n0  ... 64 - 64" }
      ],
      "explanation": [
        { "type": "text", "value": "筆算では、商を立てたあと、割る数と商をかけた数を書きます。" },
        { "type": "math", "value": "8 × 8 = 64" },
        { "type": "text", "value": "次に、割られる数から64をひきます。" },
        { "type": "math", "value": "64 - 64 = 0" },
        { "type": "text", "value": "あまりは0なので、64 ÷ 8 はわり切れます。" }
      ]
    },
    {
      "id": "import-page9-q003",
      "title": "たしかめ算のあなうめ",
      "subject": "算数・わり算のたしかめ",
      "source": "2026-05-22 18-36 ページ 9.JPEG",
      "prompt": [
        { "type": "text", "value": "□にあてはまる数を書きましょう。" },
        { "type": "math", "value": "61 ÷ 9 = 6 あまり 7\n\nこの答えは、\n9 × □ + □ = □\nでたしかめられます。" }
      ],
      "hints": [
        { "type": "text", "value": "わり算のたしかめは、割る数、商、あまりを使います。" },
        { "type": "math", "value": "割る数 × 商 + あまり = 割られる数" },
        { "type": "text", "value": "この問題では、割る数は9、商は6、あまりは7です。" }
      ],
      "answer": [
        { "type": "math", "value": "9 × 6 + 7 = 61" }
      ],
      "explanation": [
        { "type": "text", "value": "あまりのあるわり算は、次の形でたしかめます。" },
        { "type": "math", "value": "割る数 × 商 + あまり = 割られる数" },
        { "type": "text", "value": "61 ÷ 9 = 6 あまり 7 なので、9、6、7をあてはめます。" },
        { "type": "math", "value": "9 × 6 + 7 = 54 + 7 = 61" },
        { "type": "text", "value": "もとの数61になったので、答えは正しいとたしかめられます。" }
      ]
    },
    {
      "id": "import-page9-q004",
      "title": "チョコレートを分ける問題",
      "subject": "算数・わり算の文章題",
      "source": "2026-05-22 18-36 ページ 9.JPEG",
      "prompt": [
        { "type": "text", "value": "27このチョコレートを一皿に3こずつ分けます。皿は何まいいるでしょうか。\n\nかならず筆算と、たしかめも書きましょう。" }
      ],
      "hints": [
        { "type": "text", "value": "全部のチョコレートの数を、一皿に入れる数でわります。" },
        { "type": "math", "value": "27 ÷ 3" },
        { "type": "text", "value": "たしかめは、3に答えをかけて27になるかを見ます。" }
      ],
      "answer": [
        { "type": "math", "value": "27 ÷ 3 = 9" },
        { "type": "text", "value": "答え：9まい" },
        { "type": "math", "value": "たしかめ：3 × 9 = 27" }
      ],
      "explanation": [
        { "type": "text", "value": "一皿に3こずつ分けるので、27この中に3こ組がいくつできるかを考えます。" },
        { "type": "math", "value": "27 ÷ 3 = 9" },
        { "type": "text", "value": "3こ入りの皿が9まいできます。" },
        { "type": "math", "value": "3 × 9 = 27" },
        { "type": "text", "value": "たしかめで元の27こに戻るので、答えは9まいです。" }
      ]
    },
    {
      "id": "import-page9-q005",
      "title": "あめを7人に分ける問題",
      "subject": "算数・わり算の文章題",
      "source": "2026-05-22 18-36 ページ 9.JPEG",
      "prompt": [
        { "type": "text", "value": "65このあめがあります。同じ数ずつ7人に分けます。\n\n1人分は何こになるでしょうか。また、あまりはいくつでしょうか。\n\nかならず筆算と、たしかめも書きましょう。" }
      ],
      "hints": [
        { "type": "text", "value": "65このあめを7人に同じ数ずつ分けるので、65 ÷ 7 を計算します。" },
        { "type": "math", "value": "7 × 9 = 63\n7 × 10 = 70" },
        { "type": "text", "value": "70は65をこえるので、1人分は9こまでです。" }
      ],
      "answer": [
        { "type": "math", "value": "65 ÷ 7 = 9 あまり 2" },
        { "type": "text", "value": "答え：1人分は9こ、あまりは2こ" },
        { "type": "math", "value": "たしかめ：7 × 9 + 2 = 65" }
      ],
      "explanation": [
        { "type": "text", "value": "7人に同じ数ずつ分けるので、65 ÷ 7 を計算します。" },
        { "type": "math", "value": "7 × 9 = 63\n65 - 63 = 2" },
        { "type": "text", "value": "1人に9こずつ配ると63こ使い、2こあまります。" },
        { "type": "math", "value": "7 × 9 + 2 = 65" },
        { "type": "text", "value": "たしかめで元の65こに戻るので、答えは1人分9こ、あまり2こです。" }
      ]
    }
  ]
};
