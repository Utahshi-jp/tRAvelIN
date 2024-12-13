<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // パスワードのハッシュ化
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // データベースに挿入
    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $hashed_password);

    if ($stmt->execute()) {
        echo "新規登録が成功しました。";
    } else {
        echo "エラー: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
