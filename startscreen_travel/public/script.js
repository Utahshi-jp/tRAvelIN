// ログインフォームと新規登録フォームの要素を取得
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

// 切り替えリンクを取得
const switchToRegister = document.getElementById("switch-to-register");
const closeRegisterForm = document.getElementById("close-register-form");

// ログインフォームから新規登録フォームに切り替える
switchToRegister.addEventListener("click", (event) => {
    event.preventDefault();  // リンクのデフォルト動作を無効化
    loginForm.style.display = "none";
    registerForm.style.display = "block";
});

// ✕ボタンで新規登録フォームを閉じてログインフォームを表示
closeRegisterForm.addEventListener("click", () => {
    registerForm.style.display = "none";
    loginForm.style.display = "block";
});

// パスワードの可視化トグル機能
function togglePasswordVisibility(passwordId, toggleIcon) {
    var passwordField = document.getElementById(passwordId);

    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleIcon.textContent = "ー"; // アイコンを変える
    } else {
        passwordField.type = "password";
        toggleIcon.textContent = "👁"; // 元の目のアイコンに戻す
    }
}

// ログインフォームの送信処理
document.getElementById("login-button").addEventListener("click", async (event) => {
    event.preventDefault(); // ページ遷移を防ぐ

    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.text();
        if (response.ok) {
            alert("ログイン成功！");

            // UIを変更: ユーザ名を表示
            document.getElementById("open-login-modal").textContent = username;

            // モーダルを閉じる
            document.getElementById("login-modal").style.display = "none";
        } else {
            alert("ログイン失敗: " + result);
        }
    } catch (error) {
        console.error("エラー:", error);
        alert("サーバーエラーが発生しました");
    }
});

// 新規登録フォームの送信処理
document.getElementById("register-button").addEventListener("click", async (event) => {
    event.preventDefault(); // ページ遷移を防ぐ

    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const passwordConfirm = document.getElementById("register-password-confirm").value;

    if (password !== passwordConfirm) {
        alert("パスワードが一致しません");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.text();
        if (response.ok) {
            alert("新規登録が完了しました！");

            // モーダルを閉じる
            document.getElementById("register-modal").style.display = "none";
        } else {
            alert("新規登録失敗: " + result);
        }
    } catch (error) {
        console.error("エラー:", error);
        alert("サーバーエラーが発生しました");
    }
});
