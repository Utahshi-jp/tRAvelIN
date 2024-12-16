// 天気によるタブの切り替え
function setChecked(value) {
  // ラジオボタンの要素を取得
  const tab1 = document.getElementById('tab1');
  const tab2 = document.getElementById('tab2');

  // 値に応じてchecked属性を設定
  if (value === 1) {
    tab1.checked = true;
    tab2.checked = false;
  } else if (value === 2) {
    tab1.checked = false;
    tab2.checked = true;
  } else {
    console.error('Invalid value:', value);
  }
}

// 例：ページ読み込み時に1を設定
setChecked(1);