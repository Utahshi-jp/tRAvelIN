document.addEventListener("DOMContentLoaded", function () {
    // 各保存ボタンを取得
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
        // LocalStorageからスケジュールデータを取得
        let scheduleData = localStorage.getItem("generatedSchedule");

        if (!scheduleData) {
            console.error("スケジュールデータが見つかりません。");
            return;
        }

        try {
            // JSONデータをパース
            scheduleData = JSON.parse(JSON.parse(scheduleData));
        } catch (error) {
            console.error("スケジュールデータのパースに失敗しました:", error);
            return;
        }

        if (!scheduleData || !scheduleData.days) {
            console.error("スケジュールデータが不正です。");
            return;
        }

        // 編集された内容をスケジュールデータに反映
        scheduleData.days.forEach((day, dayIndex) => {
            if (day.weather === weatherType) {
                day.schedule.forEach((schedule, scheduleIndex) => {
                    const timeId = `time_${1000 + dayIndex}_${scheduleIndex}`;
                    const locationId = `location_${1000 + dayIndex}_${scheduleIndex}`;
                    const activityId = `activity_${1000 + dayIndex}_${scheduleIndex}`;

                    const timeElement = document.getElementById(timeId);
                    const locationElement = document.getElementById(locationId);
                    const activityElement = document.getElementById(activityId);

                    // 各要素の値を更新
                    if (timeElement && locationElement && activityElement) {
                        schedule.time = timeElement.value;
                        schedule.location = locationElement.value;
                        schedule.activity = activityElement.value;
                    }
                });
            }
        });

        // 修正後のスケジュールをコンソールに表示
        console.log("編集後のスケジュール:", JSON.stringify(scheduleData));
    }
});
