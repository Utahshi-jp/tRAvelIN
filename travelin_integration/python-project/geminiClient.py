#geminiClient.py (Gemini APIと接続)
import google.generativeai as genai

# APIキーの設定
genai.configure(api_key="AIzaSyBmdbPrUibaeLvmPclMhKw9RADhY6HGL5A")

# モデル準備
model = genai.GenerativeModel('gemini-pro')

# コンテンツ生成
def generate_content(question):
    try:
        response = model.generate_content(question)
        # 必要に応じて response の型を確認
        if hasattr(response, 'text'):
            return response.text
        else:
            return str(response)  # 直接文字列として返却
    except Exception as e:
        raise Exception(f"コンテンツ生成中にエラーが発生しました: {str(e)}")
