fetch('sample.json')
  .then(response => response.json())
  .then(data => {
    const resultElement = document.getElementById('sunny');
    const confirmedbutton = document.getElementById('button');
    let output = ''; // 表示する文字列を格納する変数
    let output2 = '';
    let yotei = '';
    let atai = 0;
    for (let a = 0; a < data.days.length; a++) {
      if (a % 2 == 0) {
        // console.log('a');
        const day = data.days[a].date;
        output += `<h2 class ='day'>${day}</h2>`
      }
      for (let i = 0; i < data.days[a].schedule.length; i++) {
        if (a % 2 == 0) {
          const b = data.days[a].schedule[i].activity;
          const c = data.days[a].schedule[i].time;
          output += `<p class = 'sunnytime'>${c}</p><input id =${i} name = "trip" type="trip" value=${b} class='p'><br>`;  // 各アクティビティを`<p>`タグで囲んで出力
          // console.log(b);
        }
      }
    }
    // console.log(output);
    resultElement.innerHTML = output; // 結果をHTMLに表示
  });