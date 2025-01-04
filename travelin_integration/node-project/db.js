// db.js 

// mysqlモジュールを読み込む（Node.jsでMySQLに接続するためのライブラリ）
const mysql = require('mysql');

// createConnection 関数を宣言
// MySQLサーバーへの接続情報を設定し、新しいConnectionオブジェクトを返す
const createConnection = () => {
    return mysql.createConnection({
        // 接続先のホスト名（通常はlocalhost）
        host: "localhost",

        // データベースにアクセスするためのユーザ名
        user: "root",

        // データベースにアクセスするためのパスワード
        password: "it232115Root",

        // 接続先のデータベース名
        database: "travelin_DB",
    });
};

// このファイルで定義した createConnection 関数をモジュールとして公開
module.exports = createConnection;
