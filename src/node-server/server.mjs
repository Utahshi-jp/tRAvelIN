/**********************************************************************
 * import文 (ES Modules) 
 * 
 * - express: Node.jsで定番のWebフレームワーク
 * - body-parser: リクエストボディをパースするためのミドルウェア
 * - cors: Cross-Origin Resource Sharingの設定用ミドルウェア
 * - bcrypt: パスワードハッシュ化/比較用ライブラリ
 * - path: ファイルパス操作用の組み込みモジュール
 * - child_process.spawn: 別のプロセスを生成するためのメソッド
 * - fileURLToPath, url: ES Module環境での __dirname 相当の取得用
 * - open: 指定したURLをデフォルトブラウザで開くライブラリ
 * - createConnection: ローカルファイル ./db.js に定義されている
 *   MySQL接続生成用の関数
 **********************************************************************/
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import open from 'open';
import createConnection from './db.mjs';

/**********************************************************************
 * __dirname 相当を得る
 * 
 * ES Modules 環境下では __dirname が使えないため、fileURLToPath を
 * 使って現在のファイルディレクトリを取得。
 **********************************************************************/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**********************************************************************
 * Expressアプリケーション初期化
 **********************************************************************/
const app = express();
const port = 3000; // ポート番号を3000に指定

/**********************************************************************
 * ミドルウェア設定
 * 
 * - cors(): CORSを許可するためのミドルウェア
 * - bodyParser.json(): JSON形式のボディパース
 * - bodyParser.urlencoded({ extended: true }): URLエンコードされたフォームデータをパース
 **********************************************************************/
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**********************************************************************
 * 静的ファイルの提供
 * 
 * - express.static()で、指定したディレクトリ内のファイルをそのまま配信
 * - __dirname/../ を指定し、プロジェクトルート付近を静的ファイルルートとするイメージ
 **********************************************************************/
app.use(express.static(path.join(__dirname, '/../')));

/**********************************************************************
 * favicon.icoリクエストの無視
 * 
 * - ブラウザが自動的に /favicon.ico を要求するのを 204 No Content で返し、無駄なレスポンスを減らす
 **********************************************************************/
app.get('/favicon.ico', (req, res) => res.status(204));

/**********************************************************************
 * データベース接続
 * 
 * - createConnection() は ./db.js で定義された関数
 * - connection.connect() で実際にDBへ接続
 **********************************************************************/
const connection = createConnection();

connection.connect((err) => {
    if (err) {
        console.error("データベース接続エラー:", err.message);
        process.exit(1); // 接続失敗時はプロセス終了
    }
    console.log("データベースに接続しました");
});

// FlaskサーバーのベースURLを指定
// 注意: Flaskは独立して動作しており、このサーバーから直接リクエストを送ります
const FLASK_BASE_URL = 'http://127.0.0.1:5000';


// リクエストボディをJSONとしてパースするためのミドルウェア
app.use(express.json());

// APIエンドポイント: フロントエンドからのリクエストを受け取り、Flaskに中継
// フロントエンドのリクエスト内容をそのままFlaskに送信し、レスポンスを返却
app.post('/api/schedule', async (req, res) => {
    try {
        // Flaskサーバーにデータを転送
        const response = await fetch(`${FLASK_BASE_URL}/api/schedule`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body), // フロントエンドから送信されたデータ
        });

        // Flaskのレスポンスを取得し、フロントエンドに返却
        const data = await response.json();
        res.json(data);
    } catch (error) {
        // エラー発生時の処理
        console.error('Flaskサーバーとの通信でエラーが発生しました:', error);
        res.status(500).send('Flaskサーバーとの通信に失敗しました');
    }
});

/**********************************************************************
 * ユーザー登録エンドポイント (/register)
 * 
 * - ユーザ名・パスワードを受け取り、bcryptでパスワードハッシュ化してDBに保存
 **********************************************************************/
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // 必要なデータのバリデーション
    if (!username || !password) {
        return res.status(400).send("ユーザ名とパスワードが必要です");
    }

    try {
        // パスワードハッシュ化（ソルトラウンド=10）
        const hashedPassword = await bcrypt.hash(password, 10);

        // INSERTクエリを作成し、DBにユーザを登録
        const sql = "INSERT INTO User_master (name, password) VALUES (?, ?)";
        connection.query(sql, [username, hashedPassword], (err, result) => {
            if (err) {
                console.error("Database Error:", err.message);
                return res.status(500).send("ユーザ登録に失敗しました");
            }
            // 正常終了
            res.send("新規登録が完了しました");
        });
    } catch (error) {
        console.error("Server Error:", error.message);
        res.status(500).send("サーバーエラーが発生しました");
    }
});

/**********************************************************************
 * ユーザーログインエンドポイント (/login)
 * 
 * - ユーザ名をキーにしてDBから該当ユーザを検索
 * - bcrypt.compare() でパスワード照合 
 * - 正しければ user_id を返す
 **********************************************************************/
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // バリデーション
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
            // 該当ユーザーがいない
            return res.status(401).send("ユーザ名またはパスワードが間違っています");
        }

        // 取得できたユーザー情報
        const user = results[0];
        // パスワード比較
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // 一致した場合は success: true, user_id を返す
            res.json({ success: true, user_id: user.user_id });
        } else {
            // 不一致
            res.status(401).send("ユーザ名またはパスワードが間違っています");
        }
    });
});

/**********************************************************************
 * Tentative_schedule へのデータ登録 (/save-schedule)
 * 
 * - ユーザーが入力した旅行情報を一時保存するテーブル
 **********************************************************************/
app.post('/save-schedule', (req, res) => {
    // リクエストボディから情報を取得
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

    // 必須データのバリデーション
    if (!user_id || !start_day || !last_day) {
        return res.status(400).json({ success: false, message: "必要なデータが不足しています。" });
    }

    // INSERTクエリ
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

        // 自動採番されたID(tentative_id)を返す
        const tentative_id = result.insertId;
        res.json({ success: true, tentative_id });
    });
});

/**********************************************************************
 * travel_companion へのデータ登録 (/save-companions)
 * 
 * - 人数・性別等の同行者情報を保存するテーブル
 **********************************************************************/
app.post('/save-companions', (req, res) => {
    const { tentative_id, adultmale, adultfemale, boy, girl, infant, pet } = req.body;

    // 必須データのチェック
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

/**********************************************************************
 * Tentative_schedule データ取得 (/tentative-schedule)
 * 
 * - tentative_id を指定して、一時スケジュールの内容を取得する
 **********************************************************************/
app.post('/tentative-schedule', (req, res) => {
    const { tentative_id } = req.body;

    if (!tentative_id) {
        return res.status(400).send("tentative_id が指定されていません");
    }

    const sql = 'SELECT * FROM Tentative_schedule WHERE tentative_id = ?';
    connection.query(sql, [tentative_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Tentative_schedule データ取得エラー");
        }
        // DBのレコードをJSON配列として返す
        res.json(results);
    });
});

/**********************************************************************
 * travel_companion データ取得 (/travel-companions)
 * 
 * - tentative_id を指定して、同行者情報を取得する
 **********************************************************************/
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

/**********************************************************************
 * Confirmed_schedule への保存 (/save-confirmed-schedule)
 * 
 * - ユーザーIDとjson_textを受け取り、確定版スケジュールをDBに保存
 **********************************************************************/
app.post('/save-confirmed-schedule', async (req, res) => {
    const { user_id, json_text } = req.body;
  
    if (!user_id || !json_text) {
      return res.status(400).json({ success: false, message: '必要なデータが不足しています。' });
    }
  
    try {
      // INSERTクエリ
      const sql = `
        INSERT INTO Confirmed_schedule (user_id, json_text)
        VALUES (?, ?)
      `;
      connection.query(sql, [user_id, json_text], (err, result) => {
        if (err) {
          console.error('保存エラー:', err);
          return res.status(500).json({ success: false, message: 'サーバーエラーが発生しました。' });
        }

        // 挿入されたレコードのID (MySQLの場合 result.insertId)
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

/**********************************************************************
 * 既存のConfirmed_schedule一覧を取得 (/get-confirmed-schedules)
 * 
 * - ユーザーIDを指定してDBからスケジュールを一覧取得
 **********************************************************************/
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
    // results => [{ schedule_id, user_id, json_text }, ...] を返す
    return res.json({ success: true, schedules: results });
  });
});

/**********************************************************************
 * Confirmed_schedule データの更新 (上書き) (/update-confirmed-schedule)
 * 
 * - schedule_idとuser_idをキーにしてjson_textをUPDATE
 **********************************************************************/
app.post('/update-confirmed-schedule', (req, res) => {
    const { schedule_id, user_id, json_text } = req.body;
    
    // 必須項目のチェック
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
      // affectedRows が0なら該当レコードなし
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "該当スケジュールが見つかりません。" });
      }
  
      return res.json({ success: true, message: "スケジュールが更新されました。" });
    });
});

/**********************************************************************
 * サーバーを起動
 **********************************************************************/
app.listen(port, () => {
    console.log(`サーバーがポート ${port} で起動しました`);
});
