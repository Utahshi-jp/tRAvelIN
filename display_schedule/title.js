fetch('sample.json')
  .then(response => response.json())
  .then(data => {
    const resultElement = document.getElementById('title');//htmlと連携
    let output = ''; // 表示する文字列を格納する変数
    console.log(data);
    const b = data.title;//タイトルを格納
    output += `<p><h2>${b}</h2></p>`; // 各アクティビティを`<p>`タグで囲んで出力
    console.log(output);
    resultElement.innerHTML = output; // 結果をHTMLに表示
  });