document.addEventListener("DOMContentLoaded", function () {
    const sunnyButton = document.getElementById("sunnybutton");
    const rainButton = document.getElementById("rainbutton");

    if (!sunnyButton || !rainButton) {
        console.error("保存ボタンが見つかりません。");
        return;
    }

    // 晴れボタンがクリックされた時の処理
    sunnyButton.addEventListener("click", function () {
        saveScheduleContent("sunny");
    });

    // 雨ボタンがクリックされた時の処理
    rainButton.addEventListener("click", function () {
        saveScheduleContent("rainy");
    });

    function saveScheduleContent(weatherType) {
        let scheduleData = localStorage.getItem("generatedSchedule");

        if (!scheduleData) {
            console.error("スケジュールデータが見つかりません。");
            return;
        }

        try {
            // データをパース
            scheduleData = JSON.parse(JSON.parse(scheduleData));
        } catch (error) {
            console.error("スケジュールデータのパースに失敗しました:", error);
            return;
        }

        if (!scheduleData || !scheduleData.days) {
            console.error("スケジュールデータが不正です。");
            return;
        }

        // 編集内容を反映
        scheduleData.days.forEach((day, dayIndex) => {
            if (day.weather === weatherType) {
                day.schedule.forEach((schedule, scheduleIndex) => {
                    // テキストエリアのIDを生成（スケジュールデータ構造を元に再確認）
                    const inputId = `${1000 + dayIndex}_${scheduleIndex}`;
                    const inputElement = document.getElementById(inputId);

                    if (inputElement) {
                        // テキストエリアの値をスケジュールデータに反映
                        schedule.activity = inputElement.value;
                    } else {
                        console.warn(`ID '${inputId}' に対応する要素が見つかりません。`);
                    }
                });
            }
        });

        // 修正後のスケジュールをコンソールに出力
        console.log("編集後のスケジュール:", JSON.stringify(scheduleData));
    }
});
