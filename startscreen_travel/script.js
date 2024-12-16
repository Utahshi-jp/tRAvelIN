// 各モーダル要素を取得
const loginModal = document.getElementById("login-modal");
const registerModal = document.getElementById("register-modal");

// 各ボタン要素を取得
const openLoginModal = document.getElementById("open-login-modal");
const closeLoginModal = document.getElementById("close-login-modal");
const openRegisterModal = document.getElementById("open-register-modal");
const closeRegisterModal = document.getElementById("close-register-modal");

// ログインモーダルを開く
openLoginModal.addEventListener("click", () => {
    loginModal.style.display = "flex";
});

// ログインモーダルを閉じる
closeLoginModal.addEventListener("click", () => {
    loginModal.style.display = "none";
});

// 新規登録モーダルを開く（ログインモーダルを閉じてから開く）
openRegisterModal.addEventListener("click", () => {
    loginModal.style.display = "none";
    registerModal.style.display = "flex";
});

// 新規登録モーダルを閉じる
closeRegisterModal.addEventListener("click", () => {
    registerModal.style.display = "none";
});

// モーダル外をクリックした時に閉じる
window.addEventListener("click", (event) => {
    if (event.target === loginModal) {
        loginModal.style.display = "none";
    }
    if (event.target === registerModal) {
        registerModal.style.display = "none";
    }
});

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
// 「ログイン・ユーザ登録」リンクをクリックでモーダル表示
loginLink.addEventListener("click", () => {
    loginModal.style.display = "block";
});
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
