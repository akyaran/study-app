window.DEFAULT_DECK = {
  "title": "小学4年生 学習問題",
  "description": "問題集の写真から作成した、算数と理科の練習問題です。",
  "categories": [
    { "id": "math-division", "label": "算数（割り算）" },
    { "id": "science", "label": "理科" }
  ],
  "questions": [
    {
      "id": "import-page9-q001",
      "title": "筆算のあなうめ 45 ÷ 6",
      "subject": "算数・わり算の筆算",
      "category": "math-division",
      "source": "2026-05-22 18-36 ページ 9.JPEG",
      "prompt": [
        {
          "type": "text",
          "value": "わり算の筆算をしました。□にあてはまる数を書きましょう。"
        },
        {
          "type": "image",
          "src": "images/page9-division-45-6.jpg",
          "alt": "45 ÷ 6 の筆算と、42は□×□、3は□-□で表す穴埋め問題",
          "caption": "元の問題集画像から切り出した筆算です。"
        }
      ],
      "hints": [
        {
          "type": "text",
          "value": "まず、42が何を表しているか考えます。"
        },
        {
          "type": "math",
          "value": "42 = 6 × 7"
        },
        {
          "type": "text",
          "value": "あまりの3は、45から42をひいて出します。"
        }
      ],
      "answer": [
        {
          "type": "math",
          "value": "42 ... 6 × 7\n3  ... 45 - 42"
        }
      ],
      "explanation": [
        {
          "type": "text",
          "value": "筆算で下に書く42は、割る数6と商7をかけた数です。"
        },
        {
          "type": "math",
          "value": "6 × 7 = 42"
        },
        {
          "type": "text",
          "value": "あまりは、割られる数45から42をひいて求めます。"
        },
        {
          "type": "math",
          "value": "45 - 42 = 3"
        }
      ]
    },
    {
      "id": "import-page9-q002",
      "title": "筆算のあなうめ 64 ÷ 8",
      "subject": "算数・わり算の筆算",
      "category": "math-division",
      "source": "2026-05-22 18-36 ページ 9.JPEG",
      "prompt": [
        {
          "type": "text",
          "value": "わり算の筆算をしました。□にあてはまる数を書きましょう。"
        },
        {
          "type": "image",
          "src": "images/page9-division-64-8.jpg",
          "alt": "64 ÷ 8 の筆算と、64は□×□、0は□-□で表す穴埋め問題",
          "caption": "元の問題集画像から切り出した筆算です。"
        }
      ],
      "hints": [
        {
          "type": "text",
          "value": "64は、割る数8と商8をかけた数です。"
        },
        {
          "type": "math",
          "value": "8 × 8 = 64"
        },
        {
          "type": "text",
          "value": "あまり0は、64から64をひいて出ます。"
        }
      ],
      "answer": [
        {
          "type": "math",
          "value": "64 ... 8 × 8\n0  ... 64 - 64"
        }
      ],
      "explanation": [
        {
          "type": "text",
          "value": "筆算では、商を立てたあと、割る数と商をかけた数を書きます。"
        },
        {
          "type": "math",
          "value": "8 × 8 = 64"
        },
        {
          "type": "text",
          "value": "次に、割られる数から64をひきます。"
        },
        {
          "type": "math",
          "value": "64 - 64 = 0"
        },
        {
          "type": "text",
          "value": "あまりは0なので、64 ÷ 8 はわり切れます。"
        }
      ]
    },
    {
      "id": "import-page9-q003",
      "title": "たしかめ算のあなうめ",
      "subject": "算数・わり算のたしかめ",
      "category": "math-division",
      "source": "2026-05-22 18-36 ページ 9.JPEG",
      "prompt": [
        {
          "type": "text",
          "value": "□にあてはまる数を書きましょう。"
        },
        {
          "type": "math",
          "value": "61 ÷ 9 = 6 あまり 7\n\nこの答えは、\n9 × □ + □ = □\nでたしかめられます。"
        }
      ],
      "hints": [
        {
          "type": "text",
          "value": "わり算のたしかめは、割る数、商、あまりを使います。"
        },
        {
          "type": "math",
          "value": "割る数 × 商 + あまり = 割られる数"
        },
        {
          "type": "text",
          "value": "この問題では、割る数は9、商は6、あまりは7です。"
        }
      ],
      "answer": [
        {
          "type": "math",
          "value": "9 × 6 + 7 = 61"
        }
      ],
      "explanation": [
        {
          "type": "text",
          "value": "あまりのあるわり算は、次の形でたしかめます。"
        },
        {
          "type": "math",
          "value": "割る数 × 商 + あまり = 割られる数"
        },
        {
          "type": "text",
          "value": "61 ÷ 9 = 6 あまり 7 なので、9、6、7をあてはめます。"
        },
        {
          "type": "math",
          "value": "9 × 6 + 7 = 54 + 7 = 61"
        },
        {
          "type": "text",
          "value": "もとの数61になったので、答えは正しいとたしかめられます。"
        }
      ]
    },
    {
      "id": "import-page9-q004",
      "title": "チョコレートを分ける問題",
      "subject": "算数・わり算の文章題",
      "category": "math-division",
      "source": "2026-05-22 18-36 ページ 9.JPEG",
      "prompt": [
        {
          "type": "text",
          "value": "27このチョコレートを一皿に3こずつ分けます。皿は何まいいるでしょうか。\n\nかならず筆算と、たしかめも書きましょう。"
        }
      ],
      "hints": [
        {
          "type": "text",
          "value": "全部のチョコレートの数を、一皿に入れる数でわります。"
        },
        {
          "type": "math",
          "value": "27 ÷ 3"
        },
        {
          "type": "text",
          "value": "たしかめは、3に答えをかけて27になるかを見ます。"
        }
      ],
      "answer": [
        {
          "type": "math",
          "value": "27 ÷ 3 = 9"
        },
        {
          "type": "text",
          "value": "答え：9まい"
        },
        {
          "type": "math",
          "value": "たしかめ：3 × 9 = 27"
        }
      ],
      "explanation": [
        {
          "type": "text",
          "value": "一皿に3こずつ分けるので、27この中に3こ組がいくつできるかを考えます。"
        },
        {
          "type": "math",
          "value": "27 ÷ 3 = 9"
        },
        {
          "type": "text",
          "value": "3こ入りの皿が9まいできます。"
        },
        {
          "type": "math",
          "value": "3 × 9 = 27"
        },
        {
          "type": "text",
          "value": "たしかめで元の27こに戻るので、答えは9まいです。"
        }
      ]
    },
    {
      "id": "import-page9-q005",
      "title": "あめを7人に分ける問題",
      "subject": "算数・わり算の文章題",
      "category": "math-division",
      "source": "2026-05-22 18-36 ページ 9.JPEG",
      "prompt": [
        {
          "type": "text",
          "value": "65このあめがあります。同じ数ずつ7人に分けます。\n\n1人分は何こになるでしょうか。また、あまりはいくつでしょうか。\n\nかならず筆算と、たしかめも書きましょう。"
        }
      ],
      "hints": [
        {
          "type": "text",
          "value": "65このあめを7人に同じ数ずつ分けるので、65 ÷ 7 を計算します。"
        },
        {
          "type": "math",
          "value": "7 × 9 = 63\n7 × 10 = 70"
        },
        {
          "type": "text",
          "value": "70は65をこえるので、1人分は9こまでです。"
        }
      ],
      "answer": [
        {
          "type": "math",
          "value": "65 ÷ 7 = 9 あまり 2"
        },
        {
          "type": "text",
          "value": "答え：1人分は9こ、あまりは2こ"
        },
        {
          "type": "math",
          "value": "たしかめ：7 × 9 + 2 = 65"
        }
      ],
      "explanation": [
        {
          "type": "text",
          "value": "7人に同じ数ずつ分けるので、65 ÷ 7 を計算します。"
        },
        {
          "type": "math",
          "value": "7 × 9 = 63\n65 - 63 = 2"
        },
        {
          "type": "text",
          "value": "1人に9こずつ配ると63こ使い、2こあまります。"
        },
        {
          "type": "math",
          "value": "7 × 9 + 2 = 65"
        },
        {
          "type": "text",
          "value": "たしかめで元の65こに戻るので、答えは1人分9こ、あまり2こです。"
        }
      ]
    },
    {
      "id": "science-temperature-q001",
      "title": "気温のはかり方",
      "subject": "理科・気温",
      "category": "science",
      "source": "2026-05-10 08-57 ページ 4.jpeg",
      "prompt": [
        {
          "type": "text",
          "value": "気温のはかり方について、正しい言葉を選びましょう。\n\n気温は、地面からの高さが（①）で、風通しが（②）、日光が直接（③）所ではかります。\n\nまた、このような条件で温度計を入れておく木の箱の名前も答えましょう。"
        },
        {
          "type": "image",
          "src": "images/science-temperature-page4.jpeg",
          "alt": "気温のはかり方と百葉箱についての理科問題",
          "caption": "元の問題集画像です。大問1を解いてください。"
        }
      ],
      "hints": [
        {
          "type": "text",
          "value": "気温は、人の体温や地面の熱、直射日光の影響を受けにくい場所ではかります。"
        },
        {
          "type": "text",
          "value": "学校で気温をはかるときは、温度計を白い木の箱に入れて、日光が直接当たらないようにします。"
        }
      ],
      "answer": [
        {
          "type": "text",
          "value": "① エ（1.2m〜1.5m）\n② ア（よく）\n③ キ（当たらない）\n箱の名前：百葉箱"
        }
      ],
      "explanation": [
        {
          "type": "text",
          "value": "気温は、地面に近すぎると地面の熱の影響を受けます。そのため、地面から1.2m〜1.5mくらいの高さではかります。"
        },
        {
          "type": "text",
          "value": "また、空気の温度を正しくはかるため、風通しがよく、日光が直接当たらない場所に温度計を置きます。温度計を入れる白い木の箱を百葉箱といいます。"
        }
      ]
    },
    {
      "id": "science-temperature-q002",
      "title": "気温のグラフと雲のようす",
      "subject": "理科・気温",
      "category": "science",
      "source": "2026-05-10 08-57 ページ 4.jpeg",
      "prompt": [
        {
          "type": "text",
          "value": "2日間の気温を3時間ごとにはかったグラフを見て、空の雲のようすとして正しいものを選びましょう。"
        },
        {
          "type": "image",
          "src": "images/science-temperature-page4.jpeg",
          "alt": "2日間の気温の変化を表すグラフと雲のようすを選ぶ問題",
          "caption": "元の問題集画像です。大問2を解いてください。"
        }
      ],
      "hints": [
        {
          "type": "text",
          "value": "日光がよく当たると気温は上がりやすくなります。雲が多いと日光がさえぎられ、気温は上がりにくくなります。"
        },
        {
          "type": "text",
          "value": "グラフの線が上がっているところ、下がっているところに注目して、雲がふえたかへったかを考えましょう。"
        }
      ],
      "answer": [
        {
          "type": "text",
          "value": "答え：イ\n雲は最初多かったが、しだいにへってきて、その後ふえていった。"
        }
      ],
      "explanation": [
        {
          "type": "text",
          "value": "雲が少なく日光が当たりやすいと、気温は上がりやすくなります。反対に、雲が多くなると日光がさえぎられ、気温は下がりやすくなります。"
        },
        {
          "type": "text",
          "value": "このグラフでは、気温が上がるところと下がるところがあります。気温の変化から、雲は最初多く、その後へり、またふえていったと考えられます。"
        }
      ]
    }
  ]
};
