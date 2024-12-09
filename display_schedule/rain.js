fetch('sample.json')
  .then(response => response.json())
  .then(data => {
    const resultElement = document.getElementById('rain');
    let output = ''; // 表示する文字列を格納する変数

    for (let a = 0; a < data.days.length; a++) {
        if(a % 2 == 1){
        const day = data.days[a].date;
        output += `<h2 class ='day'>${day}</h2>`
        }
      for (let i = 0; i < data.days[a].schedule.length; i++) {
        if(a % 2 == 1){
        const b = data.days[a].schedule[i].activity;
        const c = data.days[a].schedule[i].time;
        output += `<h3>${c}</h3><p class='p'>${b}</p><br>`; // 各アクティビティを`<p>`タグで囲んで出力
        }  
    }
}
    console.log(output);
    resultElement.innerHTML = output; // 結果をHTMLに表示
  });