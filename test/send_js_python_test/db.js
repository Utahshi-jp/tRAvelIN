const express = require("express");
const mysql = require("mysql");
const { exec } = require("child_process"); // Pythonスクリプトを実行するためのモジュール

const app = express();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "it232115Root",
  database: "travelin_DB",
});

connection.connect((err) => {
  if (err) {
    console.log("error connecting: " + err.stack);
    return;
  }
  console.log("success");
});

app.get("/", (req, res) => {
  connection.query("SELECT * FROM User_master", (error, userResults) => {
    if (error) {
      console.error("Error executing query on User_master: " + error.stack);
      return res.status(500).send("Database query error on User_master");
    }

    // User_masterの結果をログに表示
    console.log("User_master results:", userResults);

    connection.query(
      "SELECT * FROM Tentative_schedule",
      (error, scheduleResults) => {
        if (error) {
          console.error(
            "Error executing query on Tentative_schedule: " + error.stack
          );
          return res
            .status(500)
            .send("Database query error on Tentative_schedule");
        }

        // Tentative_scheduleの結果をログに表示
        console.log("Tentative_schedule results:", scheduleResults);

        // User_masterとTentative_scheduleのデータをJSON形式に変換
        const dataToSend = {
          users: userResults,
          schedules: scheduleResults,
        };

        exec(
          `python3 gemini.py '${JSON.stringify(dataToSend)}'`,
          (error, stdout, stderr) => {
            if (error) {
              console.error(`Error executing gemini.py: ${error.message}`);
              console.error(`Error stack: ${error.stack}`); // エラーのスタックトレースを出力
              return res.status(500).send("Error executing Python script");
            }
            if (stderr) {
              console.error(`Python script stderr: ${stderr}`);
              return res.status(500).send("Error in Python script");
            }

            // Pythonスクリプトの出力をクライアントに返す
            res.send(stdout);
          }
        );
      }
    );
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});