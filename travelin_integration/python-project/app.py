#app.py (Flaskアプリケーションのメインファイル)
from flask import Flask
import requests
import json
from geminiClient import generate_content  # Gemini APIとのやり取り
from questionBuilder import build_question  # 質問文作成モジュール

app = Flask(__name__)

@app.route('/')
def index():
    # Node.jsサーバーからデータを取得 (tentative_schedule)
    response = requests.get('http://localhost:3000/data')
    if response.status_code != 200:
        return "Node.jsサーバーからデータを取得中にエラーが発生しました", 500
    schedule_data = response.json()

    # Node.jsサーバーからデータを取得 (travel_companion)
    companions_response = requests.get('http://localhost:3000/travel-companions')
    if companions_response.status_code != 200:
        return "Node.jsサーバーからtravel-companionのデータを取得中にエラーが発生しました", 500
    companion_data = companions_response.json()

    # 質問文の作成
    question = build_question(schedule_data, companion_data)

    # コンテンツ生成
    try:
        response = generate_content(question)  # Gemini APIからコンテンツを生成
    except Exception as e:
        print(f"コンテンツ生成中にエラーが発生しました: {str(e)}")
        return "コンテンツ生成中にエラーが発生しました", 500

    # Markdownに変換して表示（コンソール出力用）
    to_markdown(response.text)

    return "データが取得され、処理が完了しました。コンソールで出力を確認してください。"

if __name__ == '__main__':
    app.run(port=5000)