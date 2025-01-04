import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import open from 'open';
import createConnection from './db.js';

// ES Module環境で __dirname を取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, '/../')));

// favicon.icoリクエストの無視
app.get('/favicon.ico', (req, res) => res.status(204));

// Database Connection
const connection = createConnection();

// データベース接続実行
connection.connect((err) => {
    if (err) {
        console.error("データベース接続エラー:", err.message);
        process.exit(1);
    }
    console.log("データベースに接続しました");
});

// Flaskアプリを起動する
const flaskApp = spawn('python', ['./../python-project/app.py'], { cwd: __dirname });

flaskApp.stdout.on('data', (data) => {
    console.log(`Flask: ${data}`);

    // Flaskアプリが起動したと判定する条件
    const readyMessage = "Running on http://127.0.0.1:5000";
    if (data.toString().includes(readyMessage)) {
        console.log("Flaskアプリが起動しました。ブラウザを開きます...");
        open('http://127.0.0.1:5000'); // Flask URLをブラウザで開く
    }
});

flaskApp.stderr.on('data', (data) => {
    console.error(`Flask Error: ${data}`);
});

flaskApp.on('close', (code) => {
    console.log(`Flask app exited with code ${code}`);
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

// ユーザーログインエンドポイント
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
            res.json({ success: true, user_id: user.user_id });
        } else {
            res.status(401).send("ユーザ名またはパスワードが間違っています");
        }
    });
});

// Tentative_scheduleへのデータ登録エンドポイント
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

// Confirmed_scheduleテーブルへの保存エンドポイント
app.post('/save-confirmed-schedule', async (req, res) => {
    const { user_id, json_text } = req.body;
  
    if (!user_id || !json_text) {
      return res.status(400).json({ success: false, message: '必要なデータが不足しています。' });
    }
  
    try {
      // Confirmed_scheduleに保存
      const sql = `
        INSERT INTO Confirmed_schedule (user_id, json_text)
        VALUES (?, ?)
      `;
      connection.query(sql, [user_id, json_text], (err, result) => {
        if (err) {
          console.error('保存エラー:', err);
          return res.status(500).json({ success: false, message: 'サーバーエラーが発生しました。' });
        }

        // 挿入されたレコードのIDは result.insertId で取得可能 (MySQL)
        const schedule_id = result.insertId;
        res.status(201).json({
          success: true,
          message: 'スケジュールが保存されました。',
          schedule_id: schedule_id,
        });
      });
    } catch (error) {
      console.error('保存エラー:', error);
      res.status(500).json({ success: false, message: 'サーバーエラーが発生しました。' });
    }
});


// ===  既存のConfirmed_scheduleを取得するエンドポイント ===
app.post('/get-confirmed-schedules', (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ success: false, message: "user_idが指定されていません" });
  }

  const sql = "SELECT schedule_id, user_id, json_text FROM Confirmed_schedule WHERE user_id = ?";
  connection.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error("get-confirmed-schedules エラー:", err);
      return res.status(500).json({ success: false, message: "スケジュール一覧の取得に失敗しました。" });
    }
    // results は [{ schedule_id, user_id, json_text }, ...] の配列
    return res.json({ success: true, schedules: results });
  });
});
// === Confirmed_schedule のデータを上書き(UPDATE)するエンドポイント ===
app.post('/update-confirmed-schedule', (req, res) => {
    const { schedule_id, user_id, json_text } = req.body;
    
    if (!schedule_id || !user_id || !json_text) {
      return res.status(400).json({ success: false, message: "必要なデータが不足しています。(schedule_id, user_id, json_text)" });
    }
    
    const sql = `
      UPDATE Confirmed_schedule 
      SET json_text = ? 
      WHERE schedule_id = ? AND user_id = ?
    `;
    connection.query(sql, [json_text, schedule_id, user_id], (err, result) => {
      if (err) {
        console.error("更新エラー:", err);
        return res.status(500).json({ success: false, message: "サーバーエラーが発生しました。" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "該当スケジュールが見つかりません。" });
      }
  
      return res.json({ success: true, message: "スケジュールが更新されました。" });
    });
  });


// サーバーを起動
app.listen(port, () => {
    console.log(`サーバーがポート ${port} で起動しました`);
});
