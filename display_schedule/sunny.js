/*＜プログラムの流れ＞ 
初期状態はjsonから取得したデータを元にhtmlを形成し、ボタン押下後はoutputからvalue(入力されているもの)を取得し表示をしている
リロードするとjsonからもう一度データを取得し、hrmlに表示をする*/
// jsonファイルの取り出し
fetch('sample.json')
  .then(response => response.json())
  .then(data => {
    const resultElement = document.getElementById('sunny');//htmlとの連携
    const confirmedbutton = document.getElementById('sunnybutton');//htmlとの連携
    let sunnyoutput = ''; // 表示する文字列を格納する変数
    let ran = 0;//数字がかぶるのを防ぐ(雨の数字とも被ってはいけない!)

    for (let a = 0; a < data.days.length; a++) {//jsonデータがある間
      const weather = data.days[a].weather;//天気を取得
      if (weather == "sunny") {//晴れの判定
        // console.log(a % 2 == 1);
        const day = data.days[a].date;//日付を取り出す
        sunnyoutput = `<h2 class ='day'>${day}</h2>`//日付の表示
        resultElement.innerHTML += sunnyoutput;
        ran += 1000;//数字がかぶるのを防ぐ(雨の数字とも被ってはいけない!)
      }
      for (let i = 0; i < data.days[a].schedule.length; i++) {
        if (weather == "sunny") {//晴れの判定
          const b = data.days[a].schedule[i].activity;//旅行予定の取り出し
          const c = data.days[a].schedule[i].time;//時間の取り出し
          let sunnyatai = a + i + ran;//inputに付けるid作成(idが一つでもかぶるとボタン処理をしたときに表示が狂うためran変数を使い調整)
          console.log(sunnyatai);
          sunnyoutput = `<p class = 'sunnytime'>${c}</p><input id = ${sunnyatai} type="text" value="${b}" class='input'><br>`; // 各アクティビティを`<p>`タグで囲んで出力
          // 結果をHTMLに表示
          resultElement.innerHTML += sunnyoutput;
          console.log(sunnyoutput);
        }
      }
    }

    // 予定確定ボタン押下時の処理
    confirmedbutton.addEventListener('click', () => {
      let output = '';//もともと入っているhtml(初期状態)の初期化
      let sunnyoutput2 = '';//ボタンが2回以上押された際、入っているデータの初期化(上書きのため)
      let ran = 0;//数字がかぶるのを防ぐ(雨の数字とも被ってはいけない!)
      console.log(output);
      for (let a = 0; a < data.days.length; a++) {//jsonデータがある間
        const weather = data.days[a].weather;//天気を取得
        if (weather == "sunny") {//晴れの判定
          // console.log(a % 2 == 1);
          const day = data.days[a].date;//日付を取り出す
          sunnyoutput2 += `<h2 class ='day'>${day}</h2>`//日付の表示
          ran += 1000;
        }
        for (let i = 0; i < data.days[a].schedule.length; i++) {
          if (weather == "sunny") {//晴れの判定
            let sunnyatai = a + i + ran;//数字がかぶるのを防ぐ(雨の数字とも被ってはいけない!)
            console.log(i);
            // 48,49行目でユーザが変更した内容(全てのinputの中身)を取得(これがないとユーザが変更した場合変更した内容が取れない
            const inputElm = document.getElementById(sunnyatai);
            const inputValue = inputElm.value;
            console.log(inputValue);
            const c = data.days[a].schedule[i].time;//時間の取得
            sunnyoutput2 += `<p class = 'sunnytime'>${c}</p><input id = ${sunnyatai} type="text" value="${inputValue}" class='input'><br>`; // 各アクティビティを`<p>`タグで囲んで出力
          }
        }
      }
      // 結果をHTMLに表示
      resultElement.innerHTML = sunnyoutput2;
    });
  });
