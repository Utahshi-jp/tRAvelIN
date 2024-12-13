fetch('sample.json')
  .then(response => response.json())
  .then(data => {
    const resultElement = document.getElementById('rain');
    const confirmedbutton = document.getElementById('button');
    let output = ''; // 表示する文字列を格納する変数
    let output2 = '';

    for (let a = 0; a < data.days.length; a++) {
      if (a % 2 == 1) {
        console.log(a % 2 == 1);
        const day = data.days[a].date;
        output += `<h2 class ='day'>${day}</h2>`
      }
      for (let i = 0; i < data.days[a].schedule.length; i++) {
        if (a % 2 == 1) {
          const b = data.days[a].schedule[i].activity;
          const c = data.days[a].schedule[i].time;
          output += `<p class = 'raintime'>${c}</p><input type="text" value="${b}" class='p'><br>`; // 各アクティビティを`<p>`タグで囲んで出力

          confirmedbutton.addEventListener('click', () => {
            //クリックイベント
            let output = '';
            for (var atai = 0; atai < data.days[a].schedule.length; atai++) {
              inputElm = document.getElementById('mytext' + a);
              yotei = inputElm;
            }
            if (a % 2 == 1) {
              console.log(a % 2 == 1);
              const day = data.days[a].date;
              output2 += `<h2 class ='day'>${day}</h2>`
            }
            output2 += `<p class = 'raintime'>${c}</p><p class='p'>${yotei}</p><br>`;
            // console.log(output);
            resultElement.innerHTML = output2;
          });
        }
      }
    }
    console.log(output);
    resultElement.innerHTML = output; // 結果をHTMLに表示
  });