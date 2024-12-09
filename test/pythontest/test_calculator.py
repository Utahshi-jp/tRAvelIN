
import unittest  # unittestモジュールをインポート
from calculator import add  # calculatorモジュールからadd関数をインポート

class TestCalculator(unittest.TestCase):
    # TestCalculatorクラスはunittest.TestCaseを継承しているため、
    # テストケースを定義できます。

    def test_add(self):
        # add関数の動作をテストするメソッド
        
        # 1と2を加算した結果が3であることを確認
        self.assertEqual(add(1, 2), 3)
        
        # -1と1を加算した結果が0であることを確認
        self.assertEqual(add(-1, 1), 0)
        
        # 0と0を加算した結果が0であることを確認
        self.assertEqual(add(0, 0), 0)
        
        # -1と-1を加算した結果が-2であることを確認
        self.assertEqual(add(-1, -1), -2)

if __name__ == '__main__':
    # スクリプトが直接実行された場合、unittestを実行
    unittest.main()