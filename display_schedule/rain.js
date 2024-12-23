// jsonファイルの取り出し
fetch('sample.json')
  .then(response => response.json())
  .then(data => {
    const resultElement = document.getElementById('rain');//htmlとの連携
    const confirmedbutton = document.getElementById('rainbutton');//htmlとの連携
    let rainoutput = ''; // 表示する文字列を格納する変数
    let ran = 0;//数字がかぶるのを防ぐ(晴れの数字とも被ってはいけない!)

    for (let a = 0; a < data.days.length; a++) {//jsonデータがある間
      const weather = data.days[a].weather;//天気を取得
      if (weather == "rainy") {//雨の判定
        // console.log(a % 2 == 1);
        const day = data.days[a].date;//日付を取り出す
        rainoutput = `<h2 class ='day'>${day}</h2>`//日付の表示
        resultElement.innerHTML += rainoutput;
        ran += 100;
      }
      for (let i = 0; i < data.days[a].schedule.length; i++) {//旅行何日分か？
        if (weather == "rainy") {//雨の判定
          const b = data.days[a].schedule[i].activity;//旅行予定の取り出し
          const c = data.days[a].schedule[i].time;//時間の取り出し
          let atai = a + i + ran;//inputに付けるid作成(idが一つでもかぶるとボタン処理をしたときに表示が狂うためran変数を使い調整)
          console.log(atai);
          rainoutput = `<p class = 'raintime'>${c}</p><textarea id = ${atai} type="text" value="${b}" class='input'>${b}</textarea><br>`; // 各アクティビティを`<input>`タグで囲んで出力
          // 結果をHTMLに表示
          resultElement.innerHTML += rainoutput;
          console.log(rainoutput);

          // 要素を取得
          const textarea = document.getElementById(atai);
          console.log(textarea);

          // textareaのサイズ調整
          document.querySelectorAll('.input').forEach(textarea => {
            textarea.addEventListener('input', () => {
              textarea.style.height = 'auto';
              textarea.style.height = textarea.scrollHeight + 'px';
            });
          });
        }
      }
    }

    // 予定確定ボタン押下時の処理
    confirmedbutton.addEventListener('click', () => {
      let rainoutput = '';//もともと入っているhtml(初期状態)の初期化
      let ran = 0;//数字がかぶらないようにする
      console.log(rainoutput);
      for (let a = 0; a < data.days.length; a++) {//jsonデータがある間
        const weather = data.days[a].weather;//天気を取得
        if (weather == "rainy") {//雨の判定
          // console.log(a % 2 == 1);
          const day = data.days[a].date;//日付の取り出し
          rainoutput += `<h2 class ='day'>${day}</h2>`//日付の表示
          ran += 100;
        }
        for (let i = 0; i < data.days[a].schedule.length; i++) {//旅行何日分か？
          if (weather == "rainy") {//雨の判定
            let atai = a + i + ran;//inputに付けるid作成(idが一つでもかぶるとボタン処理をしたときに表示が狂うためran変数を使い調整)
            console.log(i);
            // 49,50行目でユーザが変更した内容(全てのinputの中身)を取得(これがないとユーザが変更した場合変更した内容が取れない)
            const inputElm = document.getElementById(atai);
            const inputValue = inputElm.value;
            console.log(inputValue);
            const c = data.days[a].schedule[i].time;//時間の取得
            rainoutput += `<p class = 'raintime'>${c}</p><textarea id = ${atai} type="text" value="${inputValue}" class='input'>${inputValue}</textarea><br>`; // 各アクティビティを`<input>`タグで囲んで出力
          }
        }
      }
    });
  });