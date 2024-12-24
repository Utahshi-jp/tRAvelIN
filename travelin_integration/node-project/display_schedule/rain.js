document.addEventListener("DOMContentLoaded", function () {
  const schedule = localStorage.getItem('generatedSchedule');
  if (schedule) {
      const data = JSON.parse(schedule);
      const resultElement = document.getElementById('rain'); // HTMLとの連携
      const confirmedbutton = document.getElementById('rainbutton'); // HTMLとの連携
      let output = '';
      let ran = 0;

      for (let a = 0; a < data.days.length; a++) {
          const weather = data.days[a].weather;
          if (weather === "rainy") {
              const day = data.days[a].date;
              output = `<h2 class ='day'>${day}</h2>`;
              resultElement.innerHTML += output;
              ran += 100;
          }
          for (let i = 0; i < data.days[a].schedule.length; i++) {
              if (weather === "rainy") {
                  const b = data.days[a].schedule[i].activity;
                  const c = data.days[a].schedule[i].time;
                  let atai = a + i + ran;
                  output = `<p class = 'raintime'>${c}</p><textarea id = ${atai} type="text" class='input'>${b}</textarea><br>`;
                  resultElement.innerHTML += output;
              }
          }
      }

      confirmedbutton.addEventListener('click', () => {
          let output2 = '';
          ran = 0;
          for (let a = 0; a < data.days.length; a++) {
              const weather = data.days[a].weather;
              if (weather === "rainy") {
                  const day = data.days[a].date;
                  output2 += `<h2 class ='day'>${day}</h2>`;
                  ran += 100;
              }
              for (let i = 0; i < data.days[a].schedule.length; i++) {
                  if (weather === "rainy") {
                      let atai = a + i + ran;
                      const inputElm = document.getElementById(atai);
                      const inputValue = inputElm.value;
                      const c = data.days[a].schedule[i].time;
                      output2 += `<p class = 'raintime'>${c}</p><textarea id = ${atai} type="text" class='input'>${inputValue}</textarea><br>`;
                  }
              }
          }
          resultElement.innerHTML = output2;
      });
  } else {
      console.error("スケジュールデータが見つかりません。");
  }
});
