#app.py (Flaskアプリケーションのメインファイル)
from flask import Flask
import requests
import json
from geminiClient import generate_content  # Gemini APIとのやり取り
from questionBuilder import build_question  # 質問文作成モジュール
from utils import to_markdown # to_markdown の定義

app = Flask(__name__)

@app.route('/')
def index():
    try:
        # データ取得 (Node.js サーバー)
        response = requests.get('http://localhost:3000/data')
        response.raise_for_status()
        schedule_data = response.json()

        companions_response = requests.get('http://localhost:3000/travel-companions')
        companions_response.raise_for_status()
        companion_data = companions_response.json()

        # 質問文の作成
        question = build_question(schedule_data, companion_data)

        # コンテンツ生成
        content_response = generate_content(question)

        # Markdown形式に変換して出力
        to_markdown(content_response)

        return "データが取得され、処理が完了しました。コンソールで出力を確認してください。"
    except requests.RequestException as e:
        print(f"HTTPリクエストエラー: {str(e)}")
        return "HTTPリクエストエラーが発生しました", 500
    except Exception as e:
        print(f"処理中にエラーが発生しました: {str(e)}")
        return "エラーが発生しました", 500

if __name__ == '__main__':
    app.run(port=5000)