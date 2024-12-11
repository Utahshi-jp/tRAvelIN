const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "it232115Root",
  database: "travelin_DB",
});

// 接続を開始
connection.connect((err) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);
});

// データを取得するエンドポイント
app.get('/data', (req, res) => {
  const query = 'SELECT * FROM tentative_schedule WHERE tentative_id = 1'; // 実際のテーブル名に置き換えてください
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching data: ' + error.stack);
      res.status(500).send('Error fetching data');
      return;
    }
    
    // 取得したデータをJSON形式で返す
    res.json(results);
  });
});

// サーバーを起動
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});