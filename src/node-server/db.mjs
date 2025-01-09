// db.js 
import mysql from 'mysql';

// createConnection 関数を宣言
// MySQLサーバーへの接続情報を設定し、新しいConnectionオブジェクトを返す
export default function createConnection() {
    return mysql.createConnection({
        // 接続先のホスト名（通常はlocalhost）
        host: process.env.DB_HOST || 'localhost',

        // データベースにアクセスするためのユーザ名
        user: process.env.DB_USER || 'root',

        // データベースにアクセスするためのパスワード
        password: process.env.DB_PASSWORD ,

        // 接続先のデータベース名
        database: process.env.DB_NAME || 'travelin_DB',
    });
};

