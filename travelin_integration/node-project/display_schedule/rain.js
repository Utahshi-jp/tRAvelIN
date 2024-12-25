document.addEventListener("DOMContentLoaded", function () {
    // LocalStorageから保存されたスケジュールデータを取得
    let scheduleData = localStorage.getItem("generatedSchedule");

    if (!scheduleData) {
        console.error("スケジュールデータが見つかりません。");
        return;
    }

    try {
        // JSONデータをパース
        scheduleData = JSON.parse(JSON.parse(scheduleData));

        // 雨用のスケジュールを表示する要素を取得
        const resultElement = document.getElementById("rain");

        // スケジュールデータが正しい形式かを確認
        if (!scheduleData || !scheduleData.days) {
            console.error("スケジュールデータが不正です。");
            return;
        }

        let rainOutput = ""; // HTML出力用
        let ran = 0; // ユニークなIDを生成するための基数

        // 雨の日のみスケジュールを抽出
        for (let day of scheduleData.days) {
            if (day.weather === "rainy") {
                rainOutput += `<h2 class="day">${day.date}</h2>`;
                ran += 1000;

                // 各時間帯のスケジュールを生成
                for (let [i, schedule] of day.schedule.entries()) {
                    const rainId = `${ran}_${i}`;
                    rainOutput += `
                        <p class="raintime">${schedule.time}</p>
                        <textarea id="${rainId}" class="input">${schedule.activity}</textarea><br>
                    `;
                }
            }
        }

        // HTMLに反映
        resultElement.innerHTML = rainOutput;
    } catch (error) {
        console.error("スケジュールデータのパースに失敗しました:", error);
    }
});
