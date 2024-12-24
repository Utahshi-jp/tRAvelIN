document.addEventListener("DOMContentLoaded", function () {
  const schedule = localStorage.getItem('generatedSchedule');
  if (schedule) {
      const data = JSON.parse(schedule);
      const resultElement = document.getElementById('title');
      const title = data.title;
      resultElement.innerHTML = `<h1>${title}</h1>`;
  } else {
      console.error("スケジュールデータが見つかりません。");
  }
});
