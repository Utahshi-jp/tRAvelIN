fetch('sample.json')
  .then(response => response.json())
  .then(data => {
    console.log(data); // 読み込んだJSONデータをコンソールに出力
    
  })
  .catch(error => {
    console.error('Error:', error);
  });