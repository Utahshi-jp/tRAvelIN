<?php
$servername = "localhost";
$username = "root"; // XAMPPのデフォルトユーザ名
$password = "";     // XAMPPのデフォルトパスワード（空）
$dbname = "user_db";

$conn = new mysqli($servername, $username, $password, $dbname);

// 接続確認
if ($conn->connect_error) {
    die("データベース接続に失敗しました: " . $conn->connect_error);
}
?>
