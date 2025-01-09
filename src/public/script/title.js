// ページのDOMツリーが読み込まれた後に実行
document.addEventListener("DOMContentLoaded", function () {
    // タイトル入力欄の要素を取得（id="title-input"）
    const titleInput = document.getElementById("title-input");

    // 該当する要素が見つからない場合は処理中断
    if (!titleInput) {
        console.error("タイトル入力要素が見つかりません。");
        return;
    }

    // ローカルストレージから「generatedSchedule」というキー名で保存されている
    // スケジュールデータ（文字列）を取得
    let scheduleData = localStorage.getItem("generatedSchedule");

    // もしスケジュールデータが取得できなければエラーを出して終了
    if (!scheduleData) {
        console.error("スケジュールデータが見つかりません。");
        return;
    }

    try {
        // ローカルストレージに保存されているのは JSON 文字列をさらに JSON.stringify した2重の形式
        // そのため、JSON.parse を2回行う（JSON.parse(JSON.parse(...)))
        scheduleData = JSON.parse(JSON.parse(scheduleData));

        // もし scheduleData が正しく取得でき、かつタイトルがあればタイトル入力欄に反映
        if (scheduleData && scheduleData.title && titleInput) {
            // 取得したタイトルを入力欄にセット
            titleInput.value = scheduleData.title;

            /*
              タイトル入力欄(titleInput)の幅を、入力された文字列の長さに合わせて
              動的に調整する関数を定義
            */
            function adjustInputWidth() {
                // タイトル入力欄の文字幅を計測するため、一時的にspan要素を作成
                const tempSpan = document.createElement("span");
                // span要素は非表示かつ絶対配置
                tempSpan.style.visibility = "hidden";
                tempSpan.style.position = "absolute";
                // 空白を区切りとして扱わず、連続文字列を改行せずに配置するために whiteSpace="pre"
                tempSpan.style.whiteSpace = "pre";

                // フォントサイズとフォントファミリを入力欄と同じにして、実際の表示幅を計測
                tempSpan.style.fontSize = getComputedStyle(titleInput).fontSize;
                tempSpan.style.fontFamily = getComputedStyle(titleInput).fontFamily;

                // タイトル入力欄に文字が存在すればその文字を、なければプレースホルダ、さらに何もなければスペースを使う
                tempSpan.textContent = titleInput.value || titleInput.placeholder || " ";

                // bodyに一時的に追加し、描画幅を計測
                document.body.appendChild(tempSpan);

                // span要素の幅を入力欄のwidthに反映
                titleInput.style.width = tempSpan.offsetWidth + "px";

                // 計測が終わったらspan要素を削除
                document.body.removeChild(tempSpan);
            }

            // ページ読み込み直後に一度幅を調整
            adjustInputWidth();

            // ユーザーがタイトル入力欄の値を変更した時も幅を調整
            titleInput.addEventListener("input", adjustInputWidth);
        } else {
            console.error("タイトルデータが見つかりません。");
        }
    } catch (error) {
        // JSON.parse処理に失敗した場合のエラーハンドリング
        console.error("スケジュールデータのパースに失敗しました:", error);
    }
});
