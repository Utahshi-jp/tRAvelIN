fetch('sample.json')//jsonコード呼び出し
  .then(response => response.json())
  .then(data => {
    const resultElement = document.getElementById('rain');
    let output = ''; // 表示する文字列を格納する変数

    // jsonの値取得の処理
    for (let a = 0; a < data.days.length; a++) {
      if (a % 2 == 1) {
        const day = data.days[a].date;
        output += `<h2 class ='day'>${day}</h2>`//日付の取得
      }
      for (let i = 0; i < data.days[a].schedule.length; i++) {//旅行の時間(1日の旅行予定)があるだけfor文で取得
        if (a % 2 == 1) {//雨であるかの判定(jsonは交互に晴れ・雨で入っているため奇数であるほうが雨)
          const b = data.days[a].schedule[i].activity;//時間の取得
          const c = data.days[a].schedule[i].time;//旅行予定の取得
          output += `<h3 class='h3'>${c}</h3><p class='p'>${b}</p><br>`; // 各アクティビティを`<p>`タグで囲んで出力
        }
      }
    }
    console.log(output);
    resultElement.innerHTML = output; // 結果をHTMLに表示
  });