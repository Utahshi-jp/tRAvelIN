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
      // 編集リセット時はページ再描画
      location.reload();
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
   * @param {string} weatherType - "sunny" or "rainy"
   */
  function confirmSaveSchedule(weatherType) {
    if (confirm("編集内容を確定しますか？")) {
      let scheduleData = localStorage.getItem("generatedSchedule");

      if (!scheduleData) {
        console.error("スケジュールデータが見つかりません。");
        return;
      }

      try {
        // "二重JSON"を想定しているため 2回 JSON.parse
        scheduleData = JSON.parse(JSON.parse(scheduleData));

        // タイトルの変更を反映
        if (titleInput && titleInput.value) {
          scheduleData.title = titleInput.value;
        }

        // 天候ごとのスケジュールを更新
        scheduleData.days.forEach((day) => {
          if (day.weather === weatherType) {
            day.schedule.forEach((sch, index) => {
              const timeElement = document.getElementById(`time_${1000 + index}_${index}`);
              const locationElement = document.getElementById(`location_${1000 + index}_${index}`);
              const activityElement = document.getElementById(`activity_${1000 + index}_${index}`);
              const urlElement = document.getElementById(`url_${1000 + index}_${index}`);

              if (timeElement && locationElement && activityElement && urlElement) {
                sch.time = timeElement.value;
                sch.location = locationElement.value;
                sch.activity = activityElement.value;
                sch.url = urlElement.value;
              }
            });
          }
        });

        console.log("編集確定:", JSON.stringify(scheduleData));

        // DBに保存 (INSERT or UPDATE)
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
   * データベースにスケジュールを保存する関数
   * @param {Object} scheduleData - 確定したスケジュールのオブジェクト
   */
  function saveScheduleToDatabase(scheduleData) {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      console.error("user_id が localStorage に見つかりません。ログイン状態を確認してください。");
      return;
    }

    // 既存スケジュールIDがあれば UPDATE、それ以外は INSERT
    const existingScheduleId = localStorage.getItem("existingScheduleId");

    if (existingScheduleId) {
      // UPDATE (既存の Confirmed_schedule に上書き)
      fetch("/update-confirmed-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schedule_id: existingScheduleId,
          user_id: userId,
          json_text: JSON.stringify(scheduleData),
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
          console.error("スケジュール更新時にエラーが発生:", err);
          alert("スケジュール更新時にサーバーエラーが発生しました。");
        });
    } else {
      // INSERT (新規の Confirmed_schedule へ保存)
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
          } else {
            console.error("スケジュール保存に失敗:", data.message);
            alert("スケジュールの保存に失敗しました。");
          }
        })
        .catch((error) => {
          console.error("サーバーへの保存時にエラーが発生:", error);
          alert("サーバーへの保存でエラーが発生しました。");
        });
    }
  }
});
