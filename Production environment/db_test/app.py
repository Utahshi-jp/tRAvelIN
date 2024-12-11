import sys
import textwrap
import google.generativeai as genai
import json
from flask import Flask
import requests

app = Flask(__name__)

def to_markdown(text):
    text = text.replace('•', '* ')
    wrapped_text = textwrap.indent(text, '> ', predicate=lambda _: True)
    print(wrapped_text)

# APIキーの設定
genai.configure(api_key="AIzaSyBmdbPrUibaeLvmPclMhKw9RADhY6HGL5A")  # APIキーを適切に設定してください

# モデルを準備
model = genai.GenerativeModel('gemini-pro')

@app.route('/')
def index():
    # Node.jsサーバーからデータを取得
    response = requests.get('http://localhost:3000/data')
    
    # ステータスコードを確認
    if response.status_code != 200:
        return "Error fetching data from Node.js server", 500

    data = response.json()  # JSON形式でデータを取得

    # 取得したデータを確認するためにコンソールに出力
    print("取得したデータ:")
    print(json.dumps(data, indent=4, ensure_ascii=False))

    # ユーザー情報と予定を組み合わせる質問を作成
    question = "ユーザー情報: " + str(data['users']) + "\n予定: " + str(data['schedules'])

    # コンテンツを生成
    try:
        response = model.generate_content(question)
    except Exception as e:
        print(f"コンテンツ生成中にエラーが発生しました: {str(e)}")
        return "Error generating content", 500

    # Markdownに変換して表示
    to_markdown(response.text)

    return "Data retrieved and processed successfully, check console for output."

if __name__ == '__main__':
    app.run(port=5000)