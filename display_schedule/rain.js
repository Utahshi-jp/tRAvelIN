// プログラムの流れなどはkeep.txtに記載参考にしてください
// jsonファイルの取り出し
fetch('sample.json')
  .then(response => response.json())
  .then(data => {
    const resultElement = document.getElementById('rain');//htmlとの連携
    const confirmedbutton = document.getElementById('rainbutton');//htmlとの連携
    let output = ''; // 表示する文字列を格納する変数
    let ran = 0;//数字がかぶるのを防ぐ(晴れの数字とも被ってはいけない!)

    for (let a = 0; a < data.days.length; a++) {//jsonデータがある間
      const weather = data.days[a].weather;//天気を取得
      if (weather == "rainy") {//雨の判定
        // console.log(a % 2 == 1);
        const day = data.days[a].date;//日付を取り出す
        output = `<h2 class ='day'>${day}</h2>`//日付の表示
        resultElement.innerHTML += output;
        ran += 100;
      }
      for (let i = 0; i < data.days[a].schedule.length; i++) {//旅行何日分か？
        if (weather == "rainy") {//雨の判定
          const b = data.days[a].schedule[i].activity;//旅行予定の取り出し
          const c = data.days[a].schedule[i].time;//時間の取り出し
          let atai = a + i + ran;//inputに付けるid作成(idが一つでもかぶるとボタン処理をしたときに表示が狂うためran変数を使い調整)
          console.log(atai);
          output = `<p class = 'raintime'>${c}</p><input id = ${atai} type="text" value="${b}" class='input'><br>`; // 各アクティビティを`<p>`タグで囲んで出力
          // 結果をHTMLに表示
          resultElement.innerHTML += output;
          console.log(output);
        }
      }
    }

    // 予定確定ボタン押下時の処理
    confirmedbutton.addEventListener('click', () => {
      let output = '';//もともと入っているhtml(初期状態)の初期化
      let output2 = '';//ボタンが2回以上押された際、入っているデータの初期化(上書きのため)
      let ran = 0;//数字がかぶらないようにする
      console.log(output);
      for (let a = 0; a < data.days.length; a++) {//jsonデータがある間
        const weather = data.days[a].weather;//天気を取得
        if (weather == "rainy") {//雨の判定
          // console.log(a % 2 == 1);
          const day = data.days[a].date;//日付の取り出し
          output2 += `<h2 class ='day'>${day}</h2>`//日付の表示
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
            output2 += `<p class = 'raintime'>${c}</p><input id = ${atai} type="text" value="${inputValue}" class='input'><br>`; // 各アクティビティを`<p>`タグで囲んで出力
          }
        }
      }
      // 結果をHTMLに表示
      resultElement.innerHTML = output2;
    });
  });