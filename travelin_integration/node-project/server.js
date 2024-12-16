//server.js (Expressサーバーモジュール)
// 必要なモジュールをインポート
const express = require('express');
const { connectToDatabase, executeQuery } = require('./database'); // database.jsをインポート

// アプリケーション設定
const app = express();
const port = 3000;

// 接続を開始
connectToDatabase()
    .then((message) => console.log(message))
    .catch((err) => console.error(err));

// tentative_scheduleテーブルからデータを取得するエンドポイント
app.get('/data', async (req, res) => {
    const query = 'SELECT * FROM tentative_schedule WHERE tentative_id = 1';
    try {
        const results = await executeQuery(query);
        res.json(results);
    } catch (error) {
        res.status(500).send(error);
    }
});

// travel_companionテーブルからデータを取得するエンドポイント
app.get('/travel-companions', async (req, res) => {
    const query = 'SELECT * FROM travel_companion WHERE tentative_id = 1';
    try {
        const results = await executeQuery(query);
        res.json(results);
    } catch (error) {
        res.status(500).send(error);
    }
});

// サーバー起動
app.listen(port, () => {
    console.log(`サーバーは http://localhost:${port}/ で起動しています`);
});