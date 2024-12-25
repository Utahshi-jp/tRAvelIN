document.addEventListener("DOMContentLoaded", function () {
    let scheduleData = localStorage.getItem("generatedSchedule");
  
    if (!scheduleData) {
      console.error("スケジュールデータが見つかりません。");
      return;
    }
  
    try {
      // エスケープを解除してJSONをパース
      scheduleData = JSON.parse(JSON.parse(scheduleData));
  
      const resultElement = document.getElementById("rain");
  
      if (!scheduleData || !scheduleData.days) {
        console.error("スケジュールデータが不正です。");
        return;
      }
  
      let rainOutput = "";
      let ran = 0;
  
      for (let day of scheduleData.days) {
        if (day.weather === "rainy") {
          rainOutput += `<h2 class="day">${day.date}</h2>`;
          ran += 1000;
  
          for (let [i, schedule] of day.schedule.entries()) {
            const rainId = `${ran}_${i}`;
            rainOutput += `
              <p class="raintime">${schedule.time}</p>
              <textarea id="${rainId}" class="input">${schedule.activity}</textarea><br>
            `;
          }
        }
      }
  
      resultElement.innerHTML = rainOutput;
  
      // 予定確定ボタンの処理はそのまま保持
    } catch (error) {
      console.error("スケジュールデータのパースに失敗しました:", error);
    }
  });
  