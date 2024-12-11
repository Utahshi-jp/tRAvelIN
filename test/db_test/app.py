from flask import Flask
import requests

app = Flask(__name__)

@app.route('/')
def index():
    # Node.jsサーバーからデータを取得
    response = requests.get('http://localhost:3000/data')
    
    # ステータスコードを確認
    if response.status_code != 200:
        return "Error fetching data from Node.js server", 500

    data = response.json()  # JSON形式でデータを取得

    # 取得したデータをコンソールに表示
    print("Retrieved data:", data)

    return "Data retrieved successfully, check console for output."

if __name__ == '__main__':
    app.run(port=5000)