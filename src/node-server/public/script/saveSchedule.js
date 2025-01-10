// saveSchedule.js

// DOMが完全に読み込まれてから実行
document.addEventListener("DOMContentLoaded", function () {
  // ボタンや入力要素を取得
  const sunnyButton = document.getElementById("sunnybutton");   // 「晴れ予定の内容を保存」
  const rainButton = document.getElementById("rainbutton");     // 「雨予定の内容を保存」
  const titleInput = document.getElementById("title-input");    // スケジュールタイトル編集用の入力欄
  const editToggle = document.getElementById("edit-toggle");    // 「編集開始/編集リセット」ボタン

  // 必要な要素が一つでも見つからなければエラーを出して終了
  if (!sunnyButton || !rainButton || !titleInput || !editToggle) {
    console.error("必要なボタンまたは要素が見つかりません。");
    return;
  }

  // 編集モードのフラグ
  let isEditing = false;

  // ------------------------------
  // 「編集開始 / 編集リセット」ボタンの動作
  // ------------------------------
  editToggle.addEventListener("click", function () {
    // 編集モードのオン/オフを切り替える
    isEditing = !isEditing;

    // タイトルや各.input要素を編集可/不可に設定
    titleInput.disabled = !isEditing;
    document.querySelectorAll(".input").forEach((el) => (el.disabled = !isEditing));

    // ボタンのテキストを切り替える
    editToggle.textContent = isEditing ? "編集リセット" : "編集開始";

    // 編集リセットが押された場合はページをリロードし、再度表示を読み直す
    if (!isEditing) {
      location.reload();
    }
  });

  // ------------------------------
  // 「晴れ予定の内容を保存」ボタン
  // ------------------------------
  sunnyButton.addEventListener("click", function () {
    confirmSaveSchedule("sunny"); 
    // "sunny" 引数を渡して、晴天用スケジュールを保存する処理へ
  });

  // ------------------------------
  // 「雨予定の内容を保存」ボタン
  // ------------------------------
  rainButton.addEventListener("click", function () {
    confirmSaveSchedule("rainy"); 
    // "rainy" 引数を渡して、雨天用スケジュールを保存する処理へ
  });

  /**
   * スケジュールの確定処理を行う関数
   * @param {string} weatherType - "sunny" or "rainy"
   */
  function confirmSaveSchedule(weatherType) {
    // 確認ダイアログを表示し、OKなら保存処理に進む
    if (confirm("編集内容を確定しますか？")) {
      // ローカルストレージから生成済みスケジュールを取得
      let scheduleData = localStorage.getItem("generatedSchedule");

      if (!scheduleData) {
        console.error("スケジュールデータが見つかりません。");
        return;
      }

      try {
        // コード上の仕様ではJSONが2重にstringifyされている可能性があるため、2度パース
        scheduleData = JSON.parse(JSON.parse(scheduleData));

        // タイトル欄に入力された内容を反映
        if (titleInput && titleInput.value) {
          scheduleData.title = titleInput.value;
        }

        /*
          天候ごとのスケジュールを取得し、HTML上で編集されたデータを
          scheduleData.days に再反映する
        */
        scheduleData.days.forEach((day) => {
          if (day.weather === weatherType) {
            day.schedule.forEach((schedule, index) => {
              // time_xxx_xxx, location_xxx_xxx ... のIDをもつ要素を取得
              const timeElement = document.getElementById(`time_${1000 + index}_${index}`);
              const locationElement = document.getElementById(`location_${1000 + index}_${index}`);
              const activityElement = document.getElementById(`activity_${1000 + index}_${index}`);
              const urlElement = document.getElementById(`url_${1000 + index}_${index}`);

              // それぞれ存在すれば scheduleオブジェクトへ値を反映
              if (timeElement && locationElement && activityElement && urlElement) {
                schedule.time = timeElement.value;
                schedule.location = locationElement.value;
                schedule.activity = activityElement.value;
                schedule.url = urlElement.value;
              }
            });
          }
        });

        // デバッグ用に編集後のJSONを出力
        console.log("編集確定:", JSON.stringify(scheduleData));

        // 新規/既存かを分岐してサーバーに保存
        saveScheduleToDatabase(scheduleData);

        // 編集モードを終了し、入力欄などを再び編集不可にする
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
   * データベースにスケジュールを保存 (INSERTまたはUPDATE) する関数
   * @param {Object} scheduleData - 最終確定されたスケジュール情報のオブジェクト
   */
  function saveScheduleToDatabase(scheduleData) {
    // ローカルストレージからユーザーIDを取得
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      console.error("user_id が localStorage に見つかりません。ログイン状態を確認してください。");
      return;
    }

    // すでにDBに保存済みのスケジュールID (existingScheduleId) があるかどうかで処理分岐
    const existingScheduleId = localStorage.getItem("existingScheduleId");
    if (existingScheduleId) {
      // 既存IDがある → UPDATE処理
      fetch("/update-confirmed-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schedule_id: existingScheduleId,
          user_id: userId,
          json_text: JSON.stringify(scheduleData), // 更新後のスケジュールを文字列化
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
      // まだDBに存在しない → INSERT処理
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
            // 取得した schedule_id を localStorage に保存し、今後のUPDATEで利用
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
