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
        return response.text
    except Exception as e:
        raise Exception(f"コンテンツ生成中にエラーが発生しました: {str(e)}")