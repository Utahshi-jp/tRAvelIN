// ※もし表示形式をただのタイトルにする場合は、title.txtを参照
fetch('sample.json')
  .then(response => response.json())
  .then(data => {
    const resultElement = document.getElementById('title');
    let output = '';
    const b = data.title;//タイトルを格納

    // title 配列の要素をセレクトボックスのオプションとして追加
    const titles = [b, "東京旅行満喫プラン","京都旅行満喫ツアー","沖縄旅行ツアー"];//配列としてタイトルを格納する
    titles.forEach(title => {
      var count = 0;
      output = `<p><select id="selectbox_${title}">`;//セレクトボックス作成
      titles.forEach(option => {
        console.log(title);
        output += `<option id="selectbox_${option}" value="${count}">${option}</option>`;//セレクトボックスの中身を作成
        count++;
      });
      output += `</select></p>`;//閉じタグ
    });

    resultElement.innerHTML = output;//セレクトボックスをhtmlに反映

     // すべてのセレクトボックスに対してイベントリスナーを追加
    titles.forEach(option => {
      const selectElement = document.getElementById(`selectbox_${option}`);
      selectElement.addEventListener('change', (event) => {
        const selectedElement = event.target;
        const selectedValue = selectedElement.value;//セレクトボックスの中身を取得

        console.log(`選択されたセレクトボックスの値は: ${selectedValue}`);//取得したものを表示
        // ※今回はcountで数字をカウントして表示している初期値は「0」から始まる(配列の同じ)
      });
    });
  });
