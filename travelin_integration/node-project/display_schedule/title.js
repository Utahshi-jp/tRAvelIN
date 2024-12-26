document.addEventListener("DOMContentLoaded", function () {
  // タイトル要素を取得
  const titleInput = document.getElementById("title-input");

  // LocalStorageから保存されたスケジュールデータを取得
  let scheduleData = localStorage.getItem("generatedSchedule");

  if (!scheduleData) {
      console.error("スケジュールデータが見つかりません。");
      return;
  }

  try {
      // JSONデータをパース
      scheduleData = JSON.parse(JSON.parse(scheduleData));

      // スケジュールデータのタイトルを表示
      if (scheduleData && scheduleData.title && titleInput) {
          titleInput.value = scheduleData.title; // タイトルを初期表示
      } else {
          console.error("タイトルデータが見つかりません。");
      }
  } catch (error) {
      console.error("スケジュールデータのパースに失敗しました:", error);
  }
});
