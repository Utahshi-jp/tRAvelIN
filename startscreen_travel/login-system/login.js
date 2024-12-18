const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs'); // パスワードの暗号化用
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// ミドルウェア設定
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静的ファイルの提供設定
app.use(express.static('public'));

// MySQL接続設定
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // MySQLユーザー名
    password: '',       // MySQLパスワード
    database: 'travel_db' // 使用するデータベース名
});

db.connect((err) => {
    if (err) throw err;
    console.log("MySQLに接続成功");
});

// 新規登録処理
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // バリデーションチェック
    if (!username || !password) {
        return res.status(400).send("ユーザ名とパスワードが必要です");
    }

    // パスワードを暗号化
    const hashedPassword = await bcrypt.hash(password, 10);

    // MySQLにユーザ情報を保存
    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.query(sql, [username, hashedPassword], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("ユーザ登録に失敗しました");
        }
        res.send("新規登録が完了しました");
    });
});

// ログイン処理
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("ユーザ名とパスワードが必要です");
    }

    // ユーザ情報をデータベースから取得
    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("サーバーエラー");
        }
        if (results.length === 0) {
            return res.status(401).send("ユーザ名またはパスワードが間違っています");
        }

        // パスワード確認
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            res.send("ログイン成功");
        } else {
            res.status(401).send("ユーザ名またはパスワードが間違っています");
        }
    });
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`サーバーがポート ${PORT} で起動しました`);
});
