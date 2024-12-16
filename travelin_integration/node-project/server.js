const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const createConnection = require('./db');
const app = express();
const port = 3000;
const path = require('path');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, '/../')));

//favicon.icoリクエストの無視
app.get('/favicon.ico', (req, res) => res.status(204));

// Database Connection
const connection = createConnection();

// ユーザー登録エンドポイント
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("ユーザ名とパスワードが必要です");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO User_master (name, password) VALUES (?, ?)";
        connection.query(sql, [username, hashedPassword], (err, result) => {
            if (err) {
                console.error("Database Error:", err.message); // 詳細なログ
                return res.status(500).send("ユーザ登録に失敗しました");
            }
            res.send("新規登録が完了しました");
        });
    } catch (error) {
        console.error("Server Error:", error.message);
        res.status(500).send("サーバーエラーが発生しました");
    }
});

// ログインエンドポイント
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("ユーザ名とパスワードが必要です");
    }

    const sql = "SELECT * FROM User_master WHERE name = ?";
    connection.query(sql, [username], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("サーバーエラー");
        }
        if (results.length === 0) {
            return res.status(401).send("ユーザ名またはパスワードが間違っています");
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            res.send("ログイン成功");
        } else {
            res.status(401).send("ユーザ名またはパスワードが間違っています");
        }
    });
});

// tentative_scheduleデータ取得
app.get('/tentative-schedule', (req, res) => {
    const sql = 'SELECT * FROM Tentative_schedule';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("データ取得エラー");
        }
        res.json(results);
    });
});

// travel_companionデータ取得
app.get('/travel-companions', (req, res) => {
    const sql = 'SELECT * FROM travel_companion';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("データ取得エラー");
        }
        res.json(results);
    });
});

// Confirmed_scheduleデータ取得
app.get('/confirmed-schedules', (req, res) => {
    const sql = 'SELECT * FROM Confirmed_schedule';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("データ取得エラー");
        }
        res.json(results);
    });
});

// サーバーを起動
app.listen(port, () => {
    console.log(`サーバーがポート ${port} で起動しました`);
});
