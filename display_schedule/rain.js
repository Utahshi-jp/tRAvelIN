fetch('sample.json')
  .then(response => response.json())
  .then(data => {
    const resultElement = document.getElementById('rain');
    const confirmedbutton = document.getElementById('rainbutton');
    let output = ''; // 表示する文字列を格納する変数
    let output2 = '';
    let ran = 0;

    for (let a = 0; a < data.days.length; a++) {
      if (a % 2 == 1) {
        // console.log(a % 2 == 1);
        const day = data.days[a].date;
        output += `<h2 class ='day'>${day}</h2>`
        ran += 100; 
      }
      for (let i = 0; i < data.days[a].schedule.length; i++) {
        if (a % 2 === 1) {
          const b = data.days[a].schedule[i].activity;
          const c = data.days[a].schedule[i].time;
          let atai = a + i + ran;
          console.log(atai);
          output += `<p class = 'raintime'>${c}</p><input id = ${atai} type="text" value="${b}" class='input'><br>`; // 各アクティビティを`<p>`タグで囲んで出力
          // 結果をHTMLに表示
          resultElement.innerHTML = output;
          console.log(output);
        }
      }
    }

    confirmedbutton.addEventListener('click', () => {
      let output = '';
      let ran = 0;
      console.log(output);
      for (let a = 0; a < data.days.length; a++) {
        if (a % 2 == 1) {
          // console.log(a % 2 == 1);
          const day = data.days[a].date;
          output2 += `<h2 class ='day'>${day}</h2>`
          ran += 100;
        }
        for (let i = 0; i < data.days[a].schedule.length; i++) {
          if (a % 2 == 1) {
            let atai = a + i + ran;
            console.log(i);
            const inputElm = document.getElementById(atai);
            const inputValue = inputElm.value;
            console.log(inputValue);
            const c = data.days[a].schedule[i].time;
            output2 += `<p class = 'raintime'>${c}</p><p class='p'>${inputValue}</p>`; // 各アクティビティを`<p>`タグで囲んで出力
          }
        }
      }
      resultElement.innerHTML = output2;
    });

  });