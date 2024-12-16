fetch('sample.json')
  .then(response => response.json())
  .then(data => {
    const resultElement = document.getElementById('sunny');
    const confirmedbutton = document.getElementById('sunnybutton');
    let sunnyoutput = ''; // 表示する文字列を格納する変数
    let sunnyoutput2 = '';
    let ran = 0;

    for (let a = 0; a < data.days.length; a++) {
      if (a % 2 == 0) {
        // console.log(a % 2 == 1);
        const day = data.days[a].date;
        sunnyoutput += `<h2 class ='day'>${day}</h2>`
        ran += 1000;
      }
      for (let i = 0; i < data.days[a].schedule.length; i++) {
        if (a % 2 === 0) {
          const b = data.days[a].schedule[i].activity;
          const c = data.days[a].schedule[i].time;
          let sunnyatai = a + i + ran;
          console.log(sunnyatai);
          sunnyoutput += `<p class = 'sunnytime'>${c}</p><input id = ${sunnyatai} type="text" value="${b}" class='input'><br>`; // 各アクティビティを`<p>`タグで囲んで出力
          // 結果をHTMLに表示
          resultElement.innerHTML = sunnyoutput;
          console.log(sunnyoutput);
        }
      }
    }

    confirmedbutton.addEventListener('click', () => {
      let output = '';
      let ran = 0;
      console.log(output);
      for (let a = 0; a < data.days.length; a++) {
        if (a % 2 == 0) {
          // console.log(a % 2 == 1);
          const day = data.days[a].date;
          sunnyoutput2 += `<h2 class ='day'>${day}</h2>`
          ran += 1000;
        }
        for (let i = 0; i < data.days[a].schedule.length; i++) {
          if (a % 2 == 0) {
            let sunnyatai = a + i + ran;
            console.log(i);
            const inputElm = document.getElementById(sunnyatai);
            const inputValue = inputElm.value;
            console.log(inputValue);
            const c = data.days[a].schedule[i].time;
            sunnyoutput2 += `<p class = 'sunnytime'>${c}</p><p class='p'>${inputValue}</p>`; // 各アクティビティを`<p>`タグで囲んで出力
          }
        }
      }
      resultElement.innerHTML = sunnyoutput2;
    });
  });