import sys
import textwrap
import google.generativeai as genai
import json

def to_markdown(text):
    text = text.replace('•', '* ')
    wrapped_text = textwrap.indent(text, '> ', predicate=lambda _: True)
    print(wrapped_text)

# APIキーの設定
genai.configure(api_key="AIzaSyBmdbPrUibaeLvmPclMhKw9RADhY6HGL5A")  # APIキーを適切に設定してください

# モデルを準備
model = genai.GenerativeModel('gemini-pro')

# コマンドライン引数からデータを取得
try:
    input_data = json.loads(sys.argv[1])
except (IndexError, json.JSONDecodeError) as e:
    print("入力データの解析中にエラーが発生しました:", str(e))
    sys.exit(1)

# 取得したデータを確認するためにコンソールに出力
print("取得したデータ:")
print(json.dumps(input_data, indent=4, ensure_ascii=False))

# ユーザー情報と予定を組み合わせる質問を作成
question = "ユーザー情報: " + str(input_data['users']) + "\n予定: " + str(input_data['schedules'])

# コンテンツを生成
try:
    response = model.generate_content(question)
except Exception as e:
    print(f"コンテンツ生成中にエラーが発生しました: {str(e)}")
    sys.exit(1)

# Markdownに変換して表示
to_markdown(response.text)