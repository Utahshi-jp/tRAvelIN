document.addEventListener("DOMContentLoaded", function () {
    const titleInput = document.getElementById("title-input");

    if (!titleInput) {
        console.error("タイトル入力要素が見つかりません。");
        return;
    }

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

            // 入力内容に基づいて幅を動的に調整
            function adjustInputWidth() {
                const tempSpan = document.createElement("span");
                tempSpan.style.visibility = "hidden";
                tempSpan.style.position = "absolute";
                tempSpan.style.whiteSpace = "pre";
                tempSpan.style.fontSize = getComputedStyle(titleInput).fontSize;
                tempSpan.style.fontFamily = getComputedStyle(titleInput).fontFamily;

                tempSpan.textContent = titleInput.value || titleInput.placeholder || " ";
                document.body.appendChild(tempSpan);
                titleInput.style.width = tempSpan.offsetWidth + "px";
                document.body.removeChild(tempSpan);
            }

            // 初期調整
            adjustInputWidth();

            // 入力が変更された場合も調整
            titleInput.addEventListener("input", adjustInputWidth);
        } else {
            console.error("タイトルデータが見つかりません。");
        }
    } catch (error) {
        console.error("スケジュールデータのパースに失敗しました:", error);
    }
});
