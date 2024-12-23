from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from questionBuilder import build_question
from geminiClient import generate_content
from utils import to_markdown

app = Flask(__name__)
CORS(app)  # CORSを有効化

@app.route('/', methods=['POST'])
def index():
    try:
        # リクエストから JSON データを取得
        data = request.json
        tentative_id = data.get('tentative_id')
        if not tentative_id:
            return jsonify({"success": False, "error": "tentative_id が指定されていません"}), 400

        # Node.js サーバーから Tentative_schedule データを取得
        schedule_response = requests.post(
            'http://localhost:3000/tentative-schedule',
            json={"tentative_id": tentative_id}
        )
        schedule_response.raise_for_status()
        schedule_data = schedule_response.json()

        # Node.js サーバーから Travel_companion データを取得
        companion_response = requests.post(
            'http://localhost:3000/travel-companions',
            json={"tentative_id": tentative_id}
        )
        companion_response.raise_for_status()
        companion_data = companion_response.json()

        if not schedule_data or not companion_data:
            return jsonify({"success": False, "error": "指定された tentative_id に該当するデータが見つかりませんでした"}), 404

        # プロンプトを生成
        question = build_question(schedule_data, companion_data)

        # Gemini APIでコンテンツを生成
        content_response = generate_content(question)
        to_markdown(content_response)

        return jsonify({"success": True, "message": "データ処理が完了しました。"})

    except requests.RequestException as e:
        print(f"HTTPリクエストエラー: {str(e)}")
        return jsonify({"success": False, "error": "HTTPリクエストエラーが発生しました"}), 500
    except Exception as e:
        print(f"エラーが発生しました: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
