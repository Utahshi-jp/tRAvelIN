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

    sunnyButton.addEventListener("click", function () {
        confirmSaveSchedule("sunny");
    });

    rainButton.addEventListener("click", function () {
        confirmSaveSchedule("rainy");
    });

    function confirmSaveSchedule(weatherType) {
        if (confirm("編集内容を確定しますか？")) {
            let scheduleData = localStorage.getItem("generatedSchedule");

            if (!scheduleData) {
                console.error("スケジュールデータが見つかりません。");
                return;
            }

            try {
                // JSONをパース
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

                // 編集確定されたJSONをコンソールに表示
                console.log("編集確定:", JSON.stringify(scheduleData));

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
});
