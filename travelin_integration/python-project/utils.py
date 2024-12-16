# utils.py
import textwrap

def to_markdown(text):
    """
    テキストをMarkdown形式に整形してコンソールに出力する
    """
    print("=== Gemini Model Response ===")
    text = text.replace('•', '* ')
    wrapped_text = textwrap.indent(text, '> ', predicate=lambda _: True)
    print(wrapped_text)
