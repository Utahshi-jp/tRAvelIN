import textwrap
import google.generativeai as genai

def to_markdown(text):
    text = text.replace('•', '  *')
    return textwrap.indent(text, '> ', predicate=lambda _: True)

# APIキーを設定
genai.configure(api_key="AIzaSyBmdbPrUibaeLvmPclMhKw9RADhY6HGL5A")

# モデルを準備
model = genai.GenerativeModel('gemini-pro')

# ユーザーからの入力を受け取る
user_input = input("質問を入力してください: ")

response = model.generate_content(user_input)
print(to_markdown(response.text))