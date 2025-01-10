# utils.py

# textwrap: テキストを整形（折り返しやインデントなどの処理）するモジュール
import textwrap

def to_markdown(text):
    """
    テキストをMarkdown形式に整形してコンソールに出力する関数。
    GeminiモデルやLLMの応答テキストをユーザが読みやすいように加工して表示する目的で用いる。

    :param text: 整形対象となる文字列
    """

    # タイトル的な意味合いを持たせて、コンソールにヘッダーを表示
    print("=== Gemini Model Response ===")

    # ここでは '•' (黒い小丸) を '* ' (Markdownの箇条書き) に置換している。
    # Markdownでは '* ' や '- ' を先頭につけることでリスト化できるため。
    text = text.replace('•', '* ')

    # textwrap.indent(): 指定したテキストにインデントを付ける
    # 第1引数: テキスト
    # 第2引数: インデントする文字列（ここでは'> '）
    # 第3引数: predicate引数に関数を渡し、行ごとにインデントすべきかを判定
    #   → 'lambda _: True' で全行に対してインデントを入れるようにしている
    wrapped_text = textwrap.indent(text, '> ', predicate=lambda _: True)

    # インデント後のテキストをコンソールに出力
    print(wrapped_text)
