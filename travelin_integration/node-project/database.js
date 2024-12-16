// database.js(Expressサーバーモジュール)
// MySQL接続の設定
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",  // データベースのホスト
    user: "root",       // ユーザー名
    password: "it232115Root",  // パスワード
    database: "travelin_DB",  // 使用するデータベース
});

// 接続開始
function connectToDatabase() {
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject('接続エラー: ' + err.stack);
            } else {
                resolve('接続成功: ' + connection.threadId);
            }
        });
    });
}

// クエリ実行
function executeQuery(query) {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                reject('データ取得エラー: ' + error.stack);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = { connectToDatabase, executeQuery };