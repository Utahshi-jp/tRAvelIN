# app.py

# Flask本体から必要なクラスや関数をインポート
from flask import Flask, request, jsonify
# FlaskアプリにCORSを適用するためのモジュール
from flask_cors import CORS
# HTTPリクエストを行うためにrequestsライブラリを使用
import requests

# 外部ファイル（独自モジュール）から関数をインポート
# questionBuilder: build_question() → 旅行情報を元にプロンプトを組み立てる関数
# geminiClient: generate_content() → Gemini API (または外部大規模言語モデル) へ問い合わせ、コンテンツを生成する関数
# utils: to_markdown() → マークダウン形式に変換する等のユーティリティ（ここでは使われているか未確認）
from questionBuilder import build_question
from geminiClient import generate_content
from utils import to_markdown

# Flaskアプリを生成
app = Flask(__name__)
# FlaskアプリでCORSを有効化（異なるオリジンからのアクセスを許可）
CORS(app)

# ==============================
# メインのエンドポイント '/'
# ==============================
# HTTPメソッドPOSTでデータを受け取り、スケジュールID (tentative_id) をキーに
# Node.jsサーバー経由でスケジュールや同行者のデータを取得。
# 取得したデータを元にプロンプトを作成し、Gemini API でスケジュールプランを生成する。
@app.route('/', methods=['POST'])
def index():
    try:
        # リクエストのJSONデータをパース
        data = request.json
        # tentative_idを取り出す
        tentative_id = data.get('tentative_id')

        # tentative_idが無ければエラーを返す
        if not tentative_id:
            return jsonify({"success": False, "error": "tentative_id が指定されていません"}), 400

        # ------------------------------
        # Node.jsサーバー（port=3000）に対してPOSTリクエストを送り、
        # Tentative_schedule (一時スケジュール)を取得
        # ------------------------------
        schedule_response = requests.post(
            'http://localhost:3000/tentative-schedule',
            json={"tentative_id": tentative_id}
        )
        # リクエストが失敗したら例外を発生させる
        schedule_response.raise_for_status()
        # JSON形式のレスポンスをPythonのデータ構造に変換
        schedule_data = schedule_response.json()

        # ------------------------------
        # Node.jsサーバー（port=3000）に対してPOSTリクエストを送り、
        # travel_companion (同行者情報)を取得
        # ------------------------------
        companion_response = requests.post(
            'http://localhost:3000/travel-companions',
            json={"tentative_id": tentative_id}
        )
        companion_response.raise_for_status()
        companion_data = companion_response.json()

        # スケジュールや同行者データが取得できない場合
        if not schedule_data or not companion_data:
            return jsonify({"success": False, "error": "データが見つかりません"}), 404

        # ------------------------------
        # build_question() 関数で、取得したスケジュールデータと同行者データから
        # 大規模言語モデル（Gemini API）に投げる「プロンプト（質問文）」を構築
        # ------------------------------
        question = build_question(schedule_data, companion_data)

        # Gemini APIを呼び出してプラン内容を生成する
        content_response = generate_content(question)

        # 生成結果をレスポンスとして返す
        # (ここでは "schedule" キーに生成されたプランを入れている)
        return jsonify({
            "success": True,
            "message": "データ処理が完了しました。",
            "schedule": content_response
        })

    # ------------------------------
    # requestsのHTTP通信時の例外処理
    # ------------------------------
    except requests.RequestException as e:
        return jsonify({"success": False, "error": f"HTTPリクエストエラー: {str(e)}"}), 500
    # その他の例外
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ==============================
# メインプログラム
# ==============================
# Flaskアプリを port=5000 で起動。
# デフォルトでは 127.0.0.1:5000 で待ち受ける。
if __name__ == '__main__':
    app.run(port=5000)
