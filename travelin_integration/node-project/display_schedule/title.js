document.addEventListener("DOMContentLoaded", function () {
  let scheduleData = localStorage.getItem("generatedSchedule");

  if (!scheduleData) {
    console.error("スケジュールデータが見つかりません。");
    return;
  }

  try {
    // エスケープを解除してJSONをパース
    scheduleData = JSON.parse(JSON.parse(scheduleData));

    const resultElement = document.getElementById("title");

    if (scheduleData && scheduleData.title) {
      resultElement.innerHTML = `<h1>${scheduleData.title}</h1>`;
    } else {
      console.error("タイトルデータが見つかりません。");
    }
  } catch (error) {
    console.error("スケジュールデータのパースに失敗しました:", error);
  }
});
