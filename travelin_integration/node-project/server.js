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
// __dirnameはserver.jsが置かれたnode-projectディレクトリを指すので、../で一つ上に戻り、
// ルートディレクトリを静的ファイルルートとして設定
app.use(express.static(path.join(__dirname, '/../')));

//favicon.icoリクエストの無視
app.get('/favicon.ico', (req, res) => res.status(204));

// Database Connection
const connection = createConnection();

// データベース接続実行
connection.connect((err) => {
    if (err) {
        console.error("データベース接続エラー:", err.message);
        process.exit(1); // 接続に失敗したらプロセスを終了する等の対処が望ましい
    }
    console.log("データベースに接続しました");
});

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
                console.error("Database Error:", err.message);
                return res.status(500).send("ユーザ登録に失敗しました");
            }
            res.send("新規登録が完了しました");
        });
    } catch (error) {
        console.error("Server Error:", error.message);
        res.status(500).send("サーバーエラーが発生しました");
    }
});

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

        const user = results[0]; // クエリ結果の最初の行を取得
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // user_id を含むレスポンスを返す
            res.json({ success: true, user_id: user.user_id });
        } else {
            res.status(401).send("ユーザ名またはパスワードが間違っています");
        }
    });
});

//Tentative_scheduleへのデータ登録エンドポイント
app.post('/save-schedule', (req, res) => {
    const {
        user_id,
        travel_area_prefectures,
        travel_area,
        start_day,
        last_day,
        budget,
        purpose,
        others,
        starting_point
    } = req.body;

    if (!user_id || !start_day || !last_day) {
        return res.status(400).json({ success: false, message: "必要なデータが不足しています。" });
    }

    const sql = `
        INSERT INTO Tentative_schedule (
            user_id, travel_area_prefectures, travel_area,
            start_day, last_day, budget, purpose, others, starting_point
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        user_id,
        travel_area_prefectures,
        travel_area,
        start_day,
        last_day,
        budget,
        purpose,
        others,
        starting_point
    ];

    connection.query(sql, params, (err, result) => {
        if (err) {
            console.error("Tentative_schedule エラー:", err.message);
            return res.status(500).json({ success: false, message: "スケジュール登録に失敗しました。" });
        }

        const tentative_id = result.insertId; // 挿入されたレコードのID
        res.json({ success: true, tentative_id });
    });
});

//travel_companionへのデータ登録エンドポイント
app.post('/save-companions', (req, res) => {
    const { tentative_id, adultmale, adultfemale, boy, girl, infant, pet } = req.body;

    if (!tentative_id) {
        console.error("Error: tentative_id is missing.");
        return res.status(400).json({ success: false, message: "tentative_idがありません。" });
    }

    const sql = `
        INSERT INTO travel_companion (
            tentative_id, adultmale, adultfemale, boy, girl, infant, pet
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [tentative_id, adultmale, adultfemale, boy, girl, infant, pet];

    connection.query(sql, params, (err) => {
        if (err) {
            console.error("travel_companion エラー:", err.message);
            return res.status(500).json({ success: false, message: "参加人数データの挿入に失敗しました。" });
        }
        res.json({ success: true });
    });
});



// Tentative_schedule のデータ取得エンドポイント
app.post('/tentative-schedule', (req, res) => {
    const { tentative_id } = req.body; // 修正: tentaive_id -> tentative_id

    if (!tentative_id) {
        return res.status(400).send("tentative_id が指定されていません");
    }

    const sql = 'SELECT * FROM Tentative_schedule WHERE tentative_id = ?'; // 修正: tentaive_id -> tentative_id
    connection.query(sql, [tentative_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Tentative_schedule データ取得エラー");
        }
        res.json(results);
    });
});

// Travel_companion のデータ取得エンドポイント
app.post('/travel-companions', (req, res) => {
    const { tentative_id } = req.body;
    if (!tentative_id) {
        return res.status(400).send("tentative_id が指定されていません");
    }

    const sql = 'SELECT * FROM travel_companion WHERE tentative_id = ?';
    connection.query(sql, [tentative_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Travel_companion データ取得エラー");
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
