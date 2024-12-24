document.addEventListener("DOMContentLoaded", function () {
  const schedule = localStorage.getItem('generatedSchedule');
  if (schedule) {
      const data = JSON.parse(schedule);
      const resultElement = document.getElementById('sunny'); // HTMLとの連携
      const confirmedbutton = document.getElementById('sunnybutton'); // HTMLとの連携
      let sunnyoutput = ''; // 表示する文字列を格納する変数
      let ran = 0; // 数字がかぶるのを防ぐ(雨の数字とも被ってはいけない!)

      for (let a = 0; a < data.days.length; a++) {
          const weather = data.days[a].weather; // 天気を取得
          if (weather === "sunny") { // 晴れの判定
              const day = data.days[a].date; // 日付を取り出す
              sunnyoutput = `<h2 class ='day'>${day}</h2>`; // 日付の表示
              resultElement.innerHTML += sunnyoutput;
              ran += 1000; // 数字がかぶるのを防ぐ(雨の数字とも被ってはいけない!)
          }
          for (let i = 0; i < data.days[a].schedule.length; i++) {
              if (weather === "sunny") { // 晴れの判定
                  const b = data.days[a].schedule[i].activity; // 旅行予定の取り出し
                  const c = data.days[a].schedule[i].time; // 時間の取り出し
                  let sunnyatai = a + i + ran; // inputに付けるid作成
                  sunnyoutput = `<p class = 'sunnytime'>${c}</p><textarea id = ${sunnyatai} type="text" class='input'>${b}</textarea><br>`;
                  resultElement.innerHTML += sunnyoutput;
              }
          }
      }

      confirmedbutton.addEventListener('click', () => {
          let sunnyoutput2 = ''; // ボタンが2回以上押された際、入っているデータの初期化
          ran = 0; // 再利用
          for (let a = 0; a < data.days.length; a++) {
              const weather = data.days[a].weather; // 天気を取得
              if (weather === "sunny") {
                  const day = data.days[a].date; // 日付を取り出す
                  sunnyoutput2 += `<h2 class ='day'>${day}</h2>`;
                  ran += 1000;
              }
              for (let i = 0; i < data.days[a].schedule.length; i++) {
                  if (weather === "sunny") {
                      let sunnyatai = a + i + ran;
                      const inputElm = document.getElementById(sunnyatai);
                      const inputValue = inputElm.value;
                      const c = data.days[a].schedule[i].time; // 時間の取得
                      sunnyoutput2 += `<p class = 'sunnytime'>${c}</p><textarea id = ${sunnyatai} type="text" class='input'>${inputValue}</textarea><br>`;
                  }
              }
          }
          resultElement.innerHTML = sunnyoutput2;
      });
  } else {
      console.error("スケジュールデータが見つかりません。");
  }
});
