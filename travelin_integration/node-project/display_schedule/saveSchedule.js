// saveSchedule.js

document.addEventListener("DOMContentLoaded", function () {
  const sunnyButton = document.getElementById("sunnybutton");
  const rainButton = document.getElementById("rainbutton");
  const titleInput = document.getElementById("title-input");
  const editToggle = document.getElementById("edit-toggle");

  if (!sunnyButton || !rainButton || !titleInput || !editToggle) {
    console.error("必要なボタンまたは要素が見つかりません。");
    return;
  }

  let isEditing = false;

  // 編集開始・リセットトグルボタン
  editToggle.addEventListener("click", function () {
    isEditing = !isEditing;
    titleInput.disabled = !isEditing;
    document.querySelectorAll(".input").forEach((el) => (el.disabled = !isEditing));
    editToggle.textContent = isEditing ? "編集リセット" : "編集開始";

    if (!isEditing) {
      location.reload(); // 編集リセット時に再描画
    }
  });

  // 「晴れ予定の内容を保存」ボタン
  sunnyButton.addEventListener("click", function () {
    confirmSaveSchedule("sunny");
  });

  // 「雨予定の内容を保存」ボタン
  rainButton.addEventListener("click", function () {
    confirmSaveSchedule("rainy");
  });

  /**
   * スケジュールの確定処理
   * @param {string} weatherType "sunny" もしくは "rainy"
   */
  function confirmSaveSchedule(weatherType) {
    if (confirm("編集内容を確定しますか？")) {
      let scheduleData = localStorage.getItem("generatedSchedule");

      if (!scheduleData) {
        console.error("スケジュールデータが見つかりません。");
        return;
      }

      try {
        // 既存のコードでは "二重の JSON文字列" を想定しているため、2回パース
        scheduleData = JSON.parse(JSON.parse(scheduleData));

        // タイトルの変更を反映
        if (titleInput && titleInput.value) {
          scheduleData.title = titleInput.value;
        }

        // 天候ごとのスケジュールを更新
        scheduleData.days.forEach((day) => {
          if (day.weather === weatherType) {
            day.schedule.forEach((schedule, index) => {
              const timeElement = document.getElementById(`time_${1000 + index}_${index}`);
              const locationElement = document.getElementById(`location_${1000 + index}_${index}`);
              const activityElement = document.getElementById(`activity_${1000 + index}_${index}`);
              const urlElement = document.getElementById(`url_${1000 + index}_${index}`);

              if (timeElement && locationElement && activityElement && urlElement) {
                schedule.time = timeElement.value;
                schedule.location = locationElement.value;
                schedule.activity = activityElement.value;
                schedule.url = urlElement.value;
              }
            });
          }
        });

        // 編集確定された JSON をコンソールに表示 (デバッグ用)
        console.log("編集確定:", JSON.stringify(scheduleData));

        // === 追記: 新規 or 既存かを分岐して保存 ===
        saveScheduleToDatabase(scheduleData);

        // 編集モード終了
        isEditing = false;
        titleInput.disabled = true;
        document.querySelectorAll(".input").forEach((el) => (el.disabled = true));
        editToggle.textContent = "編集開始";

      } catch (error) {
        console.error("スケジュールデータのパースに失敗しました:", error);
      }
    }
  }

  /**
   * データベースにスケジュールを保存 (新規 or 更新) する関数
   * @param {Object} scheduleData - 確定したスケジュールのオブジェクト
   */
  function saveScheduleToDatabase(scheduleData) {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      console.error("user_id が localStorage に見つかりません。ログイン状態を確認してください。");
      return;
    }

    // === 既存スケジュールIDがあるかどうかで分岐 ===
    const existingScheduleId = localStorage.getItem("existingScheduleId");
    if (existingScheduleId) {
      // 既に DB に登録済みのスケジュールなので UPDATE
      fetch("/update-confirmed-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schedule_id: existingScheduleId,
          user_id: userId,
          json_text: JSON.stringify(scheduleData), // JSON文字列として送る
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log("既存スケジュールが更新されました:", data);
          } else {
            console.error("スケジュール更新に失敗:", data.message);
            alert("スケジュールの更新に失敗しました。");
          }
        })
        .catch((err) => {
          console.error("スケジュール更新エラー:", err);
          alert("スケジュール更新時にエラーが発生しました。");
        });
    } else {
      // まだ DB にないスケジュールなので INSERT
      fetch("/save-confirmed-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          json_text: JSON.stringify(scheduleData),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log("新規スケジュールが保存されました:", data);

            // 新しいスケジュールIDを localStorage に保存
            localStorage.setItem("existingScheduleId", data.schedule_id);
          } else {
            console.error("スケジュール保存に失敗:", data.message);
            alert("スケジュールの保存に失敗しました。");
          }
        })
        .catch((error) => {
          console.error("サーバーへの保存時にエラーが発生:", error);
          alert("サーバーへの保存時にエラーが発生しました。");
        });
    }
  }
});
