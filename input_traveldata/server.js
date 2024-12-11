const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MySQL データベースに接続
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'your_database'
});

db.connect((err) => {
    if (err) {
        console.error('データベース接続エラー:', err);
        return;
    }
    console.log('MySQLに接続しました');
});

app.use(bodyParser.json());

// ユーザー登録処理
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // ユーザー名とハッシュ化されたパスワードをデータベースに保存
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: '登録に失敗しました' });
        } else {
            res.status(201).json({ message: '登録成功' });
        }
    });
});

// ログイン処理
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // ユーザー名に基づいてデータベースからユーザー情報を取得
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'エラーが発生しました' });
        } else if (results.length === 0) {
            res.status(401).json({ message: 'ユーザーが見つかりません' });
        } else {
            const user = results[0];
            
            // 入力されたパスワードとハッシュ化されたパスワードを比較
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                res.status(200).json({ message: 'ログイン成功' });
            } else {
                res.status(401).json({ message: 'パスワードが違います' });
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
