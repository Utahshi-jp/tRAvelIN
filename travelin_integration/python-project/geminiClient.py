# geminiClient.py (Gemini APIと接続)

# google.generativeai モジュールをインポート
# Gemini APIを利用してコンテンツ生成を行うためのライブラリ
import google.generativeai as genai

# ==============================
# APIキーの設定
# ==============================
# genai.configure を使用して、Gemini APIの利用に必要なAPIキーを設定する
# （本番運用ではソースコードに直接埋め込むのではなく、環境変数や秘密管理を利用するのが望ましい）
genai.configure(api_key="AIzaSyBmdbPrUibaeLvmPclMhKw9RADhY6HGL5A")

# ==============================
# モデル準備
# ==============================
# gemai.GenerativeModel('gemini-pro') を呼び出すことで
# 指定のモデル（ここでは 'gemini-pro'）を用いてコンテンツ生成を行うインスタンスを作成する。
model = genai.GenerativeModel('gemini-pro')

# ==============================
# コンテンツ生成を行う関数
# ==============================
# question: ユーザーからの問い合わせやプロンプトなどのテキスト。
# これをモデルに渡してコンテンツ（応答）を生成する。
def generate_content(question):
    try:
        # model.generate_content(question) を呼び出すと
        # Gemini API へ question（プロンプト）を送信し、応答を受け取る
        response = model.generate_content(question)

        # response に text という属性が存在するかを確認
        # 多くの場合は response.text に生成されたテキストが格納される想定
        if hasattr(response, 'text'):
            return response.text
        else:
            # text 属性がなければ、response 全体を文字列化して返却
            return str(response)

    except Exception as e:
        # 例外発生時には詳細メッセージ付きで再度例外を投げる
        raise Exception(f"コンテンツ生成中にエラーが発生しました: {str(e)}")
