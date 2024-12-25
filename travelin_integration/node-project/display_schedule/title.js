document.addEventListener("DOMContentLoaded", function () {
  // LocalStorageから保存されたスケジュールデータを取得
  let scheduleData = localStorage.getItem("generatedSchedule");

  if (!scheduleData) {
      console.error("スケジュールデータが見つかりません。");
      return;
  }

  try {
      // JSONデータをパース
      // LocalStorageに保存されているデータがエスケープされている可能性があるため、二重にパース
      scheduleData = JSON.parse(JSON.parse(scheduleData));

      // タイトルを表示する要素を取得
      const resultElement = document.getElementById("title");

      // スケジュールデータにタイトルが含まれている場合は表示
      if (scheduleData && scheduleData.title) {
          resultElement.innerHTML = `<h1>${scheduleData.title}</h1>`;
      } else {
          console.error("タイトルデータが見つかりません。");
      }
  } catch (error) {
      console.error("スケジュールデータのパースに失敗しました:", error);
  }
});
