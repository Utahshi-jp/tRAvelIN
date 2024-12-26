#questionBuilder.py(プロンプトの生成モジュール)
def build_question(schedule_data, companion_data):
    """
    旅行スケジュールに基づいて、Geminiモデルに送信する質問文を作成する関数。
    :param schedule_data: tentative_scheduleテーブルから取得したデータ（辞書）
    :param companion_data: travel_companionテーブルから取得したデータ（辞書）
    :return: 質問文の文字列
    """
    question = (
        "あなたは敏腕の旅行プランナーです。以下の条件に基づいて最適な旅行スケジュールを立ててください。\n\n"
        "1.晴天時の屋外中心の旅行スケジュールと悪天候時の屋内中心の旅行スケジュールの二つを作成する。(晴天時に屋内を計画に入れるのは可)\n"
        "2.突然の天候変化に対応できるよう晴天時と悪天候時の旅行スケジュールは可能な限り目的地を近くする。\n"
        "3.旅行の開始地点は" + str(schedule_data[0]['starting_point']) + "、旅行の目的地は" + str(schedule_data[0]['travel_area']) + "の範囲から決める。\n"
        "旅行の開始日は" + str((schedule_data[0]['start_day']).split("T")[0]) + "、旅行の終了日は" + str((schedule_data[0]['last_day']).split("T")[0]) + "、\n"
        "旅行の予算は" + str(schedule_data[0]['budget']) + "円、旅行の目的は飲食、観光、アクティビティ、イベントの中だと" + str(schedule_data[0]['purpose']) + "、\n"
        "旅行に同行する人数は16歳以上の男性が" + str(companion_data[0]['adultmale']) + "人、16歳以上の女性が" + str(companion_data[0]['adultfemale']) + "人、\n"
        "15歳以下の男の子が" + str(companion_data[0]['boy']) + "人、15歳以下の女の子が" + str(companion_data[0]['girl']) + "人、幼児が\n"
        + str(companion_data[0]['infant']) + "人、ペットが" + str(companion_data[0]['pet']) + "匹、他に「" + str(schedule_data[0]['others']) + "」という条件も満たす。\n\n"
        "全てのlocationでは詳細な店名、施設名を出す。また、urlではlocationの店や施設の公式サイトのurlを出してください。"
        "5.出力の形式は以下のjsonの形式に合わせる。それ以外の余計な文章は一切出力しないでください。\n\n"
        "{\n"
        '    "title": "〇〇旅行スケジュール",\n'
        '    "days": [\n'
        '      {\n'
        '        "date": "1日目(x月y日)",\n'
        '        "weather": "sunny", \n'
        '        "schedule": [\n'
        '          {\n'
        '            "time": "9:00",\n'
        '            "activity": "新幹線で〇〇駅到着",\n'
        '            "location": "〇〇駅",\n'
        '            "url":"(〇〇駅の公式サイトのurl)"\n'
        '          },\n'
        '          {\n'
        '            "time": "10:00",\n'
        '            "activity": "ホテルチェックイン",\n'
        '            "location": "△△ホテル",\n'
        '            "url":"(△△ホテルの公式サイトのurl)"\n'
        '          },\n'
        '          #以下同様に続く\n'
        '        ]\n'
        '      },\n'
        '      {\n'
        '        "date": "1日目(x月y日)",\n'
        '        "weather": "rainy", \n'
        '        "schedule": [\n'
        '            {\n'
        '                "time": "9:00",\n'
        '                "activity": "新幹線で〇〇駅到着",\n'
        '                "location": "〇〇駅",\n'
        '                "url":"(〇〇駅の公式サイトのurl)"\n'
        '              },\n'
        '              {\n'
        '                "time": "10:00",\n'
        '                "activity": "ホテルチェックイン",\n'
        '                "location": "ホテル",\n'
        '                "url":"(△△ホテルの公式サイトのurl)"\n'
        '              },\n'
        '              #以下同様に続く\n'
        '        ]\n'
        '      },\n'
        '      {\n'
        '        "date": "2日目(10月12日)",\n'
        '        "weather": "sunny", \n'
        '        "schedule": [\n'
        '                {\n'
        '                    # ここにスケジュールを追加\n'
        '                }\n'
        '        ]\n'
        '        #以下同様に続く\n'
        '      }\n'
        '    ]\n'
        '}'
    )

    return question