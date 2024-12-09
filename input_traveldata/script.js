document.addEventListener('DOMContentLoaded', function() {
    const accordionItems = document.querySelectorAll('.accordion-item'); // リスト項目を取得
    
    

    // アコーディオンの開閉処理
    accordionItems.forEach(item => {
        item.addEventListener('click', function() {
            const panel = this.nextElementSibling; // クリックされた項目の次のパネル（隠れている部分）を取得
            const isOpen = panel.style.display === 'block';
            panel.style.display = isOpen ? 'none' : 'block'; // パネルを開閉

            // アコーディオン項目の開閉状態に応じて「open」クラスを切り替え
            if (isOpen) {
                this.classList.remove('open');
            } else {
                this.classList.add('open');
            }
        });
    });
    setupDestinationSection();

    // チェックリストの選択状態をジャンル選択に反映する処理
    const genreCheckboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    const genreItem = document.querySelector('.accordion-item[data-for="genre-button"]'); // ジャンルを選択するli要素

    genreCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateGenreSelection(); // 選択されたジャンルを更新
        });
    });

    // 選択されたジャンルをまとめて表示する関数
    function updateGenreSelection() {
        const selectedGenres = []; // 選択されたジャンルを格納する配列

        genreCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedGenres.push(checkbox.parentNode.textContent.trim()); // 選択されたチェックボックスのテキストを追加
            }
        });

        if (selectedGenres.length > 0) {
            genreItem.textContent = selectedGenres.join('、');
            genreItem.style.color = 'black'; // 選択がある場合はテキストの色を黒にする
        } else {
            genreItem.textContent = 'ジャンルを選択';
            genreItem.style.color = '#7b7b7b'; // 選択がない場合はデフォルト色に戻す
        }    
    }

    // ボタンのテキストを入力内容に反映する処理
    accordionItems.forEach(item => {
        item.addEventListener('click', function() {
            const input = document.getElementById(item.dataset.for); // 関連する入力フィールドを取得
            if (!input) return;

            // 旅行期間を選択した場合の処理
            if (input.id === 'travel-period') {
                const startDate = document.getElementById('travel-period').value;
                const endDate = document.getElementById('travel-period-end').value;
                item.textContent = startDate && endDate ? `旅行期間: ${startDate} - ${endDate}` : '旅行期間を入力';
            } 
            // 人数・性別のカウンターボタンに関する処理
            else if (['adult-male', 'adult-female', 'child-male', 'child-female', 'infant', 'pet'].includes(input.id)) {
                updatePeopleGenderButton(item); // ボタンに人数情報を反映
            } 
            else if (item.dataset.for === 'budget') {
                updateBudgetSelection(); 
            }
            // 通常のテキスト入力の場合
            else {
                item.textContent = input.value ? input.value : item.dataset.defaultText;
            }
        });
    });

    // 人数・性別のカウンターボタンの処理
    const incrementPeopleButtons = document.querySelectorAll('.increment-people');
    const decrementPeopleButtons = document.querySelectorAll('.decrement-people');

    incrementPeopleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            input.value = parseInt(input.value) + 1;
            updatePeopleGenderButton(this.closest('.accordion').querySelector('.accordion-item'));
        });
    });

    decrementPeopleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.nextElementSibling;
            if (parseInt(input.value) > 0) {
                input.value = parseInt(input.value) - 1;
            }
            updatePeopleGenderButton(this.closest('.accordion').querySelector('.accordion-item'));
        });
    });
    // 人数・性別選択ボタンに選択した人数を反映する関数
    function updatePeopleGenderButton(item) {
        const adultMale = parseInt(document.getElementById('adult-male').value);
        const adultFemale = parseInt(document.getElementById('adult-female').value);
        const childMale = parseInt(document.getElementById('child-male').value);
        const childFemale = parseInt(document.getElementById('child-female').value);
        const infant = parseInt(document.getElementById('infant').value);
        const pet = parseInt(document.getElementById('pet').value);

        let buttonText = '';
        if (adultMale > 0 && adultFemale > 0) {
            buttonText += `大人：男${adultMale}女${adultFemale} `;
        } else {
            if (adultMale > 0) buttonText += `大人：男${adultMale} `;
            if (adultFemale > 0) buttonText += `大人：女${adultFemale} `;
        }

        if (childMale > 0 && childFemale > 0) {
            buttonText += `子供：男${childMale}女${childFemale} `;
        } else {
            if (childMale > 0) buttonText += `子供：男${childMale} `;
            if (childFemale > 0) buttonText += `子供：女${childFemale} `;
        }

        if (infant > 0) buttonText += `幼児：${infant} `;
        if (pet > 0) buttonText += `ペット：${pet} `;

         // 一定の文字数で改行を挿入する関数
        const maxLength = 14;  // 改行を入れる最大文字数
        let formattedText = '';
        let line = '';
        
        // 単語の切れ目を意識して改行する
        buttonText.split(' ').forEach((word, index) => {
            // 現在の行の長さが最大文字数を超えたら改行を挿入
            if ((line + word).length > maxLength) {
                formattedText += line + '<br>';
                line = word;  // 新しい行に現在の単語をセット
            } else {
                line += (line ? ' ' : '') + word;  // すでに行があればスペースを追加して単語を追加
            }
        });

        // 最後の行を追加
        formattedText += line;

        if (formattedText.trim()) {
            item.innerHTML = formattedText.trim();
            item.style.color = 'black';  // 入力されたら黒にする
        } else {
            item.innerHTML = '人数と性別を選択';
            item.style.color = '#7b7b7b';  // 入力がない場合はデフォルト色
        }
    }

    const incrementBudgetButtons = document.querySelectorAll('.increment-budget');
    const decrementBudgetButtons = document.querySelectorAll('.decrement-budget');
    const decrementBudgetthousandButtons = document.querySelectorAll('.decrement-budget-thousand');
    
    let hasIncrementedTenThousand = false; // 1万円が最初に増加されたかのフラグ
    let hasIncrementedHundredThousand = false; // 10万円が最初に増加されたかのフラグ


    // 予算を増加させる処理（1万円、10万円の特別処理）
    incrementBudgetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const incrementValue = parseInt(button.getAttribute('data-value'));
            const budget1000 = parseInt(document.getElementById('budget').value); // 1000円のカウンターの値

            // 1000円のカウンターが4000円以下の時に1万円または10万円が増加する処理
            if ((incrementValue === 10000 || incrementValue === 100000) && budget1000 <= 4000 && !hasIncrementedTenThousand && !hasIncrementedHundredThousand) {
                // 初回の1万円または10万円の増加処理（最初は10000円または100000円に設定）
                input.value = incrementValue; // 10000円または100000円にセット
                document.getElementById('budget').value = 0; // 1000円のカウンターを0に設定
                if (incrementValue === 10000) {
                    hasIncrementedTenThousand = true; // 初回の1万円増加フラグを立てる
                } else if (incrementValue === 100000) {
                    hasIncrementedHundredThousand = true; // 初回の10万円増加フラグを立てる
                }
            } else {
                // 通常の増加処理
                input.value = parseInt(input.value) + incrementValue;
            }

            updateBudgetSelection(); // 予算を更新
        });
    });


    // 予算を減少させる処理（1000円単位）
    decrementBudgetthousandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.nextElementSibling;
            const newValue = parseInt(input.value) - parseInt(button.getAttribute('data-value'));
            
            // 現在の合計予算を計算
            const budget10000 = parseInt(document.getElementById('budget-thousand').value);
            const budget100000 = parseInt(document.getElementById('budget-hundred-thousand').value);
            const totalBudget = newValue + budget10000 + budget100000; // 1000円単位を引いた後の合計を計算

            // 合計予算が5000円以上になる場合のみ値を更新
            if (totalBudget >= 4000 && newValue >= 0) {
                input.value = newValue;
                updateBudgetSelection(); // 予算を更新
            }
        });
    });

    // 予算を減少させる処理（1万円、10万円単位）
    decrementBudgetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.nextElementSibling;
            const newValue = parseInt(input.value) - parseInt(button.getAttribute('data-value'));

            // 現在の合計予算を計算
            const budget1000 = parseInt(document.getElementById('budget').value);
            const budget10000 = parseInt(document.getElementById('budget-thousand').value);
            const budget100000 = parseInt(document.getElementById('budget-hundred-thousand').value);

            // 減少対象に応じて合計予算を計算
            const totalBudget = budget1000 + budget10000 + budget100000 - parseInt(button.getAttribute('data-value'));

            // 合計予算が5000円以上になる場合のみ値を更新
            if (totalBudget >= 4000 && newValue >= 0) {
                input.value = newValue;
            }

            // 合計予算が4000円以下で、1000円のカウンターが4000以下の場合の処理
            if (budget1000 <= 4000) {
                // 1万円のカウンターが0の場合、10万円を0にしたとき1000を4000に戻す
                if (budget10000 === 0 && parseInt(input.value) === budget100000) {
                    document.getElementById('budget-hundred-thousand').value = 0; // 10万円を0にする
                    document.getElementById('budget').value = 4000; // 1000円を4000に戻す
                    hasIncrementedTenThousand = true; // 初回の増加フラグを立てる
                    hasIncrementedHundredThousand = false; // 10万円のフラグをリセット
                }

                // 10万円のカウンターが0の場合、1万円を0にしたとき1000を4000に戻す
                if (budget100000 === 0 && parseInt(input.value) === budget10000) {
                    document.getElementById('budget-thousand').value = 0; // 1万円を0にする
                    document.getElementById('budget').value = 4000; // 1000円を4000に戻す
                    hasIncrementedTenThousand = false; // 1万円のフラグをリセット
                    hasIncrementedHundredThousand = true; // 初回の増加フラグを立てる
                }
            }
            updateBudgetSelection(); // 予算を更新
        });
    });


    // 合計予算を表示・更新する処理
    function updateBudgetSelection() {
        const budget1000 = parseInt(document.getElementById('budget').value);
        const budget10000 = parseInt(document.getElementById('budget-thousand').value);
        const budget100000 = parseInt(document.getElementById('budget-hundred-thousand').value);

        // 合計予算を計算
        const totalBudget = budget1000 + budget10000 + budget100000;

        // アコーディオンボタンに合計予算を反映
        const budgetSelectionLi = document.querySelector('.accordion-item[data-for="budget"]');
        if (totalBudget > 4000) {
            budgetSelectionLi.textContent = `予算: ${totalBudget.toLocaleString()}円`;
            budgetSelectionLi.style.color = 'black'; 
        } else {
            budgetSelectionLi.textContent = '予算を選択  ※最低5000円から'; // 予算がゼロの場合
            budgetSelectionLi.style.color = '#7b7b7b'; 
        }
    }

    // 初期表示時に予算内容を更新
    updateBudgetSelection();

    


    // 初期表示時にボタンの内容を更新
    updatePeopleGenderButton(document.querySelector('.accordion-item[data-for="people-gender"]'));

    // カレンダー設定
    flatpickr("#calendar-container", {
        mode: "range",
        dateFormat: "Y年m月d日",
        locale: "ja",
        minDate: "today",
        maxWidth: "100%",  // 最大幅を100%に設定
        height: "auto",  // 高さは自動調整
        inline: true, // インラインモードでカレンダーを表示
        onReady: function(selectedDates, dateStr, instance) {
            // カレンダーの親要素の幅を調整
            instance.calendarContainer.style.width = '50%';
            instance.calendarContainer.style.maxWidth = '50%';
        },
        onChange: function(selectedDates, dateStr, instance) {
            if (selectedDates.length === 2) {
                const startDate = selectedDates[0];
                const endDate = selectedDates[1];
                const formattedStartDate = instance.formatDate(startDate, "Y年m月d日");
                const formattedEndDate = instance.formatDate(endDate, "Y年m月d日");
    
                const item = document.querySelector('.accordion-item[data-for="travel-period-button"]');
                item.textContent = `${formattedStartDate} ～ ${formattedEndDate}`;
                item.style.color = 'black'; 
            }
        }
    });
    
});
document.querySelector('.plan-button').addEventListener('click', function(event) {
    let isValid = true; // フォーム全体のバリデーションフラグ
    const errorMessages = []; // エラーメッセージを格納する配列

    // 旅行先入力のバリデーション
    const destinationLi = document.querySelector('.accordion-item[data-for="destination"]');
    const destinationInput = document.getElementById('travel-period');
    if (destinationLi.textContent.trim() === "旅行先を入力" || destinationInput.value.trim() === "") {
        isValid = false;
        errorMessages.push("旅行先を入力してください");
        destinationLi.style.color = 'red'; // エラー時に赤くする
    } else {
        destinationLi.style.color = 'black'; // 問題がなければ黒に戻す
    }

    // 旅行期間入力のバリデーション
    const travelPeriodLi = document.querySelector('.accordion-item[data-for="travel-period-button"]');
    const calendarInput = document.querySelector('#calendar-container');
    if (travelPeriodLi.textContent.trim() === "旅行期間を入力" || calendarInput.innerText.trim() === "") {
        isValid = false;
        errorMessages.push("旅行期間を入力してください");
        travelPeriodLi.style.color = 'red';
    } else {
        travelPeriodLi.style.color = 'black';
    }

    // 人数・性別入力のバリデーション
    const peopleGenderLi = document.querySelector('.accordion-item[data-for="people-gender"]');
    const adultMale = document.getElementById('adult-male').value;
    const adultFemale = document.getElementById('adult-female').value;
    const childMale = document.getElementById('child-male').value;
    const childFemale = document.getElementById('child-female').value;
    const infant = document.getElementById('infant').value;
    const pet = document.getElementById('pet').value;

    // 全てが0の場合はエラー
    if (adultMale === "0" && adultFemale === "0" && childMale === "0" && childFemale === "0" && infant === "0" && pet === "0") {
        isValid = false;
        errorMessages.push("人数と性別を選択してください");
        peopleGenderLi.style.color = 'red';
    } else {
        peopleGenderLi.style.color = 'black';
    }

    // 予算のバリデーション
    const budgetLi = document.querySelector('.accordion-item[data-for="budget"]');
    const budget = document.getElementById('budget').value;
    if (budget === "4000" || budget-thousand === "0" || budget-hundred-thousand === "0") {
        isValid = false;
        errorMessages.push("予算を選択  ※最低5000円から");
        budgetLi.style.color = 'red';
    } else {
        budgetLi.style.color = 'black';
    }

    // ジャンル選択のバリデーション
    const genreLi = document.querySelector('.accordion-item[data-for="genre-button"]');
    const selectedGenres = Array.from(document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked'));
    if (selectedGenres.length === 0) {
        isValid = false;
        errorMessages.push("ジャンルを選択してください");
        genreLi.style.color = 'red';
    } else {
        genreLi.style.color = 'black';
    }

    // バリデーション結果を確認
    if (!isValid) {
        event.preventDefault(); // バリデーションに失敗した場合は送信を防ぐ
        alert("以下の項目を入力してください:\n" + errorMessages.join("\n"));
    } else {
        alert("プランが正常に作成されました！");
        // 正常ならここでフォーム送信処理などを行う
    }
});

function setupDestinationSection() {
    // 47都道府県の市町村を配列に格納
    const data = [
        // 北海道
        ['枝幸町','猿払村','豊富町','中頓別町','浜頓別町','幌延町','利尻町','利尻富士町','礼文町','稚内市',
            '愛別町','旭川市','遠別町音威子府村','上川町','上富良野町','剣淵町','士別町','占冠村','下川町','初山別村',
            '鷹栖町','天塩町','当麻町','苫前町','中川町','中富良野町','名寄市','羽幌町','東神楽町','東川町',
            '美瑛町','美深町','比布町','富良野市','幌加内町','増毛町','南富良野町',
            '留萌市','和寒町','網走市','遠軽町','雄武町','大空町','置戸町','興部町','北見市','清里町',
            '訓子府町','小清水町','佐呂間町','斜里町','滝上町','津別町','西興部村','美幌町','紋別市','湧別町',
            '厚岸町','釧路市','釧路町','標茶町','標津町','白糠町','鶴居村','弟子屈町','中標津町','根室市',
            '浜中町','別海町','羅臼町','足寄町','池田町','浦幌町','音更町','帯広市','上士幌町','更別村','鹿追町',
            '士幌町','清水町','新得町','大樹町','豊頃町','中札内村','広尾町','本別町','幕別町','芽室町','陸別町',
            '厚真町','安平町','浦河町','えりも町','様似町','白老町','新ひだか町','壮瞥町','伊達市','洞爺湖町',
            '苫小牧市','豊浦町','新冠町','登別市','日高町','取町','むかわ町','室蘭市','赤井川村','赤平市','芦別市',
            '石狩市','岩内町','岩見沢市','歌志内市','浦臼町','雨竜町','恵庭市','江別市','小樽市','上砂川町','神恵内村',
            '北広島市','喜茂別町','京極町','共和町','倶知安町','栗山町','黒松内町札幌市','島牧村','積丹町','新篠津村',
            '新十津川町','寿都町','砂川市','滝川市','秩父別町','千歳市','月形町','当別町','泊村','奈井江町','長沼町','南幌町',
            '仁木町','ニセコ町','沼田町','美唄市','深川市','古平町','北竜町','真狩村','三笠市','妹背牛町','夕張市','由仁町','余市町',
            '蘭越町','留寿都村','厚沢部町','今金町','江差町','奥尻町','長万部町','乙部町','上ノ国町','木古内町','鹿部町','知内町せたな町',
            '七飯町','函館市','福島町','北斗市','松前町','森町','八雲町'],

            // 青森県
        ['青森市','鰺ヶ沢町','板柳町','田舎館村','今別町','おいらせ町','大間町','大鰐町','風間浦村','黒石市',
            '五所川原市','五戸町','佐井村','三戸町','新郷村','外ヶ浜町','田子町','つがる市','鶴田町','東北町',
            '十和田市','中泊町','南部町','西目屋村','野辺地町','階上町','八戸市','東通村','平川市','平内町','弘前市',
            '深浦町','藤崎町','三沢市','むつ市','横浜町','蓬田村','六戸町','六ヶ所村'],

            // 岩手県
        ['一関市','一戸町','岩泉町','岩手町','奥州市','大槌町','大船渡市','金ケ崎町','釜石市','軽米町','北上市',
            '久慈市','葛巻町','九戸村','雫石町','紫波町','住田町','滝沢市','田野畑村','遠野市','西和賀町','二戸市',
            '野田村','八幡平市','花巻市','平泉町','洋野町','普代村','宮古市','盛岡市','矢巾町','山田町','陸前高田市'],

            // 宮城県
        ['石巻市','岩沼市','大河原町','大崎市','大郷町','大衡村','女川町','角田市','加美町','川崎町','栗原市','気仙沼市',
            '蔵王町','塩竈市','色麻町','七ヶ宿町','七ヶ浜町','柴田町','白石市','仙台市','大和町','多賀城市','富谷市','登米市',
            '名取市','東松島市','松島町','丸森町','美里町','南三陸町','村田町','山元町','利府町','涌谷町','亘理町'],

        // 秋田県
        ['秋田市','井川町','羽後町','大潟村','大館市','男鹿市','潟上市','鹿角市','上小阿仁村','北秋田市','小坂町','五城目町',
            '仙北市','大仙市','にかほ市','能代市','八郎潟町','八峰町','東成瀬村','藤里町','美郷町','三種町','湯沢市','由利本荘市','横手市'],

        // 山形県
        ['朝日町','飯豊町','大石田町','大江町','大蔵村','小国町','尾花沢市','金山町','河北町','上山市','川西町','酒田市','寒河江市','鮭川村',
            '庄内町','白鷹町','新庄市','高畠町','鶴岡市','天童市','戸沢村','中山町','長井市','南陽市','西川町','東根市','舟形町','真室川町','三川町',
            '村山市','最上町','山形市','山辺町','遊佐町','米沢市'],

        // 福島県
        ['会津坂下町','会津美里町','会津若松市','浅川町','飯舘村','石川町','泉崎村','猪苗代町','いわき市','大熊町','大玉村','小野町','鏡石町','葛尾村',
            '金山町','川内村','川俣町','喜多方市','北塩原村','国見町','桑折町','郡山市','鮫川村','下郷町','昭和村','白河市','新地町','須賀川市','相馬市',
            '只見町','棚倉町','玉川村','田村市','伊達市','天栄村','富岡町','中島村','浪江町','楢葉町','西会津町','西郷村','二本松市','塙町','磐梯町','檜枝岐村',
            '平田村','広野町','福島市','古殿町','三島町','南会津町','南相馬市','三春町','本宮市','柳津町','矢吹町','矢祭町','湯川村'],

        // 茨城県
        ['水戸市','日立市','土浦市','古河市','石岡市','結城市','龍ケ崎市','下妻市','常総市','常陸太田市','高萩市','北茨城市','笠間市','取手市','牛久市','つくば市',
            'ひたちなか市','鹿嶋市','潮来市','守谷市','常陸大宮市','那珂市','筑西市','坂東市','稲敷市','かすみがうら市','桜川市','神栖市','行方市','鉾田市','つくばみらい市',
            '小美玉市','茨城町','大洗町','城里町','那珂郡','東海村','大子町','美浦村','阿見町','河内町','結城郡','八千代町','五霞町','境町','利根町'],

        // 栃木県
        ['宇都宮市','足利市','栃木市','佐野市','鹿沼市','日光市','小山市','真岡市','大田原市','矢板市','那須塩原市','さくら市','那須烏山市','下野市','上三川町','益子町',
            '茂木町','市貝町','芳賀町','壬生町','野木町','塩谷町','高根沢町','那須町','那珂川町'],

        // 群馬県
        ['前橋市','高崎市','桐生市','伊勢崎市','太田市','沼田市','館林市','渋川市','藤岡市','富岡市','安中市','みどり市','榛東村','吉岡町','上野村','神流町','下仁田町',
            '南牧村','甘楽町','中之条町','長野原町','嬬恋村','草津町','高山村','東吾妻町','片品村','川場村','昭和村','みなかみ町','佐波郡','玉村町','板倉町','明和町','千代田町','大泉町','邑楽町'],

        // 埼玉県
        ["さいたま市西区","さいたま市北区","さいたま市大宮区","さいたま市見沼区","さいたま市中央区","さいたま市桜区","さいたま市浦和区","さいたま市南区","さいたま市緑区",
            "川越市","熊谷市","川口市","行田市","秩父市","所沢市","飯能市","加須市","本庄市","東松山市","狭山市","羽生市","鴻巣市","深谷市","上尾市","草加市","越谷市","蕨市",
            "戸田市","入間市","朝霞市","志木市","和光市","新座市","桶川市","久喜市","北本市","八潮市","富士見市","三郷市","蓮田市","坂戸市","幸手市","鶴ヶ島市","日高市","吉川市",
            "ふじみ野市","白岡市","北足立郡伊奈町","入間郡三芳町","入間郡毛呂山町","入間郡越生町","比企郡滑川町","比企郡嵐山町","比企郡小川町","比企郡川島町","比企郡吉見町",
            "比企郡鳩山町","比企郡ときがわ町","秩父郡横瀬町","秩父郡皆野町","秩父郡長瀞町","秩父郡小鹿野町","秩父郡東秩父村","児玉郡美里町","児玉郡神川町","児玉郡上里町","大里郡寄居町",
            "南埼玉郡宮代町","北葛飾郡杉戸町","北葛飾郡松伏町"],

        // 千葉県
        ["千葉市中央区","千葉市花見川区","千葉市稲毛区","千葉市若葉区","千葉市緑区","千葉市美浜区","銚子市","市川市","船橋市","館山市","木更津市","松戸市","野田市","茂原市","成田市",
            "佐倉市","東金市","旭市","習志野市","柏市","勝浦市","市原市","流山市","八千代市","我孫子市","鴨川市","鎌ケ谷市","君津市","富津市","浦安市","四街道市","袖ケ浦市","八街市",
            "印西市","白井市","富里市","南房総市","匝瑳市","香取市","山武市","いすみ市","大網白里市","印旛郡酒々井町","印旛郡栄町","香取郡神崎町","香取郡多古町","香取郡東庄町","山武郡九十九里町",
            "山武郡芝山町","山武郡横芝光町","長生郡一宮町","長生郡睦沢町","長生郡長生村","長生郡白子町","長生郡長柄町","長生郡長南町","夷隅郡大多喜町","夷隅郡御宿町","安房郡鋸南町"],

        // 東京都
        ["千代田区","中央区","港区","新宿区","文京区","台東区","墨田区","江東区","品川区","目黒区","大田区", "世田谷区", "渋谷区", "中野区", "杉並区","豊島区","北区","荒川区","板橋区","練馬区",
            "足立区","葛飾区","江戸川区","八王子市","立川市","武蔵野市","三鷹市","青梅市","府中市", "昭島市","調布市","町田市","小金井市","小平市","日野市","東村山市","国分寺市","国立市","福生市",
            "狛江市","東大和市","清瀬市","東久留米市","武蔵村山市","多摩市","稲城市","羽村市","あきる野市","西東京市","瑞穂町","日の出町","檜原村","奥多摩町","大島町","利島村","新島村","神津島村",
            "三宅村","御蔵島村","八丈町","青ヶ島村","小笠原村"],

        // 神奈川県
        ["横浜市鶴見区","横浜市神奈川区","横浜市西区","横浜市中区","横浜市南区","横浜市保土ケ谷区","横浜市磯子区","横浜市金沢区","横浜市港北区","横浜市戸塚区","横浜市港南区","横浜市旭区","横浜市緑区",
            "横浜市瀬谷区","横浜市栄区","横浜市泉区","横浜市青葉区","横浜市都筑区","川崎市川崎区","川崎市幸区","川崎市中原区","川崎市高津区","川崎市多摩区","川崎市宮前区","川崎市麻生区","相模原市緑区",
            "相模原市中央区","相模原市南区","横須賀市","平塚市","鎌倉市","藤沢市","小田原市","茅ヶ崎市","逗子市","三浦市","秦野市","厚木市","大和市","伊勢原市","海老名市","座間市","南足柄市","綾瀬市",
            "葉山町","寒川町","大磯町","二宮町","中井町","大井町","松田町","山北町","開成町","箱根町","真鶴町","湯河原町","愛川町"],

        // 新潟県
        ['阿賀野市','阿賀町','粟島浦村','出雲崎町','糸魚川市','魚沼市','小千谷市','柏崎市','加茂市','刈羽村','五泉市','佐渡市','三条市','新発田市','上越市',
            '聖籠町','関川村','胎内市','田上町','津南町','燕市','十日町市','長岡市','新潟市','見附市','南魚沼市','妙高市','村上市','弥彦村','湯沢町',],

        // 富山県
        ['朝日町','射水市','魚津市','小矢部市','上市町','黒部市','高岡市','立山町','砺波市','富山市','滑川市','南砺市','入善町','氷見市','舟橋村'],

        // 石川県
        ['穴水町','内灘町','加賀市','金沢市','かほく市','川北町','小松市','志賀町','珠洲市','津幡町','中能登町','七尾市','能登町','野々市市','能美市',
        '羽咋市','白山市','宝達志水町','輪島市'],

        // 福井県
        ['あわら市','池田町','永平寺町','越前市','越前町','おおい町','大野市','小浜市','勝山市','坂井市','鯖江市','高浜町','敦賀市','福井市','南越前町','美浜町','若狭町'],

        // 山梨県
        ["甲府市","富士吉田市","都留市","山梨市","大月市", "韮崎市","南アルプス市","北杜市","甲斐市","笛吹市",
        "上野原市","甲州市","中央市","市川三郷町","早川町","身延町","南部町","富士川町","昭和町","道志村","西桂町","忍野村","山中湖村","鳴沢村","富士河口湖町","小菅村","丹波山村"],

        // 長野県
        ["長野市","松本市","上田市","岡谷市","飯田市","諏訪市","須坂市","小諸市","伊那市","駒ヶ根市","中野市","大町市","飯山市","茅野市","塩尻市","佐久市","千曲市","東御市",
            "安曇野市","小海町","川上村","南牧村","南相木村","北相木村","佐久穂町","軽井沢町","御代田町","立科町","青木村","長和町","下諏訪町","富士見町","原村","辰野町","箕輪町","飯島町",
            "南箕輪村","中川村","宮田村","松川町","高森町","阿南町","阿智村","平谷村","根羽村","下條村","売木村","天龍村","泰阜村","喬木村","豊丘村","大鹿村","上松町","南木曽町","木祖村",
            "王滝村","大桑村","木曽町","麻績村","生坂村","山形村","朝日村","筑北村","池田町","松川村","白馬村","小谷村","坂城町","小布施町","高山村","山ノ内町","木島平村","野沢温泉村","信濃町","小川村","飯綱町","栄村"],

        // 岐阜県
        ["岐阜市","大垣市","高山市","多治見市","関市", "中津川市","美濃市","瑞浪市","羽島市","恵那市","美濃加茂市","土岐市","各務原市","可児市","山県市", "瑞穂市","飛騨市","本巣市","郡上市","下呂市","海津市","岐南町",
            "笠松町","養老町","垂井町","関ケ原町","神戸町","輪之内町","安八町","揖斐川町","大野町","池田町","北方町","坂祝町","富加町","川辺町","七宗町","八百津町","白川町","東白川村","御嵩町","白川村"],

        // 静岡県
        ["静岡市葵区","静岡市駿河区","静岡市清水区","浜松市中央区","浜松市浜名区","浜松市天竜区","沼津市","熱海市","三島市","富士宮市","伊東市","島田市","富士市","磐田市","焼津市", "掛川市","藤枝市","御殿場市","袋井市",
            "下田市","裾野市","湖西市","伊豆市","御前崎市","菊川市","伊豆の国市","牧之原市","東伊豆町","河津町","南伊豆町","松崎町","西伊豆町","函南町","清水町","長泉町","小山町","吉田町","川根本町","森町"],

        // 愛知県
        ["名古屋市千種区","名古屋市東区","名古屋市北区","名古屋市西区","名古屋市中村区","名古屋市中区",  "名古屋市昭和区","名古屋市瑞穂区","名古屋市熱田区","名古屋市中川区","名古屋市港区","名古屋市南区","名古屋市守山区",
            "名古屋市緑区","名古屋市名東区","名古屋市天白区","豊橋市","岡崎市","一宮市","瀬戸市","半田市","春日井市","豊川市","津島市","碧南市","刈谷市","豊田市","安城市","西尾市","蒲郡市","犬山市","常滑市","江南市","小牧市",
            "稲沢市","新城市","東海市","大府市","知多市","知立市","尾張旭市","高浜市","岩倉市","豊明市","日進市","田原氏","愛西市","清須市","北名古屋市","弥富市","みよし市","あま市","長久手市","東郷町","豊山町","大口町",
            "扶桑町","大治町","蟹江町","飛島村","阿久比町","東浦町","南知多町","美浜町","武豊町","幸田町","設楽町","東栄町","豊根村"],

        // 三重県
        ["津市","四日市市","伊勢市","松阪市","桑名市","鈴鹿市","名張市","尾鷲市","亀山市","鳥羽市","熊野市","いなべ市","志摩市","伊賀市","木曽岬町","東員町","菰野町","朝日町","川越町","多気町","明和町","大台町","玉城町",
            "度会町","大紀町","南伊勢町","紀北町","御浜町","紀宝町"],

        // 滋賀県
        ['愛荘町','近江八幡市','大津市','草津市','甲賀市','甲良町','湖南市','高島市','多賀町','豊郷町','長浜市','東近江市','彦根市','日野町','米原市','守山市','野洲市',
            '栗東市','竜王町'],

        // 京都府
        ['綾部市','井手町','伊根町','宇治市','宇治田原町','大山崎町','笠置町','亀岡市','木津川市','京田辺市','京丹後市','京丹波町','京都市','久御山町','城陽市','精華町',
            '長岡京市','南丹市','福知山市','舞鶴市','南山城村','宮津市','向日市','八幡市','与謝野町','和束町'],

        // 大阪府
        ['池田市','泉大津市','泉佐野市','和泉市','茨木市','大阪狭山市','大阪市','貝塚市','柏原市','交野市','門真市','河南町','河内長野市','岸和田市','熊取町','堺市','四條畷市',
            '島本町','吹田市','摂津市','泉南市','太子町','高石市','高槻市','田尻町','忠岡町','大東市','千早赤阪村','豊中市','豊能町','富田林市','寝屋川市','能勢町','羽曳野市',
            '阪南市','東大阪市','枚方市','藤井寺市','松原市','岬町','箕面市','守口市','八尾市'],

        // 兵庫県
        ['相生市','明石市','赤穂市','朝来市','芦屋市','尼崎市','淡路市','伊丹市','市川町','猪名川町','稲美町','小野市','加古川市','加西市','加東市','神河町','上郡町','香美町',
            '川西市','神戸市','佐用町','三田市','宍粟市','新温泉町','洲本市','太子町','高砂市','多可町','宝塚市','たつの市','丹波篠山市','丹波市','豊岡市','西宮市','西脇市','播磨町',
            '姫路市','福崎町','三木市','南あわじ市','養父市'],

        // 奈良県
        ['明日香村','安堵町','斑鳩町','生駒市','宇陀市','王寺町','大淀町','橿原市','香芝市','葛城市','上北山村','河合町','川上村','川西町','上牧町','黒滝村','広陵町','五條市','御所市',
            '桜市','三郷町','下市町','下北山村','曽爾村','高取町','田原本町','天川村','天理市','十津川村','奈良市','野迫川村','東吉野村','平群町','御杖村','三宅町','山添村','大和郡山市','大和高田市','吉野町'],

        // 和歌山県
        ['有田川町','有田市','印南町','岩出市','海南市','かつらぎ町','上富田町','北山村','紀の川市','紀美野町','串本町','九度山町','高野町','古座川町','御坊市','白浜町','新宮市','すさみ町','太地町','田辺市',
            '那智勝浦町','橋本市','日高町','広川町','みなべ町','美浜町','湯浅町','由良町','和歌山市'],

        // 鳥取県
        ['岩美町','倉吉市','江府町','琴浦町','境港市','大山町','智頭町','鳥取市','南部町','日南町','日吉津村','日野町','北栄町','三頭町','八頭町','湯梨浜町','米子市','若桜町'],

        // 島根県
        ['海士町','飯南町','出雲市','雲南市','大田市','邑南町','隠岐の島町','奥出雲町','川本町','江津市','知夫村','津和野町','西ノ島町','浜田市','益田市','松江市','美郷町','安来市','吉賀町'],

        // 岡山県
        ['赤磐市','浅口市','井原市','岡山市','鏡野町','笠岡市','吉備中央町','久米南町','倉敷市','里庄町','勝央町','新庄村','瀬戸内市','総社市','高梁市','玉野市','津山市','奈義町','新見市','西粟倉村',
            '早島町','備前市','真庭市','美咲町','美作市','矢掛町','和気町'],

        // 広島県
        ['安芸太田町','安芸高田市','江田島市','大崎上島町','大竹市','尾道市','海田町','北広島町','熊野町','呉市','坂町','庄原市','神石高原町','世羅町','竹原市','廿日市市','東広島市','広島市安芸区',
            '広島市安佐北区','広島市安佐南区','広島市佐伯区','広島市中区','広島市西区','広島市東区','広島市南区','福山市','府中市','府中町','三原市','三次市'],

        // 山口県
        ['阿武町','岩国市','宇部市','上関町','下松市','山陽小野田市','下関市','周南市','周防大島町','田布施町','長門市','萩市','光市','平生町','防府市','美祢市','柳井市','山口市','和木町'],

        // 徳島県
        ['藍住町','阿南市','阿波市','石井町','板野町','海陽町','勝浦町','上板町','上勝町','神山町','北島町','小松島市','佐那河内村','つるぎ町','徳島市','那賀町','鳴門市','東みよし町','松茂町','美波町',
            '美馬市','三好市','牟岐町','吉野川市'],

        // 香川県
        ['綾川町','宇多津町','観音寺市','琴平町','坂出市','さぬき市','小豆島町','善通寺市','高松市','多度津町','土庄町','直島町','東かがわ市','丸亀市','まんのう町','三木町','三豊市'],

        // 愛媛県
        ['愛南町','伊方町','今治市','伊予市','内子町','宇和島市','大洲市','上島町','鬼北町','久万高原町','西条市','四国中央市','西予市','東温市','砥部町','新居浜市','松前町','松野町','松山市','八幡浜市'],

        // 高知県
        ['安芸市','いの町','馬路村','大川村','大月町','大豊町','越知町','香美市','北川村','黒潮町','芸西村','高知市','香南市','佐川町','四万十市','四万十町','宿毛市','須崎市','田野町','津野町','東洋町','土佐市',
            '土佐清水市','土佐町','中土佐町','奈半利町','南国市','仁淀川町','日高村','三原村','室戸市','本山町','安田町','檮原町'],

        // 福岡県
        ['赤村','朝倉市','芦屋町','飯塚市','糸島市','糸田町','うきは市','宇美町','大川市','大木町','大任町','大野城市','大牟田市','岡垣町','小郡市','遠賀町','春日市','粕屋町','嘉麻市','川崎町','香春町','苅田町',
            '北九州市','鞍手町','久留米市','桂川町','上毛町','古賀市','小竹町','篠栗町','志免町','新宮町','須恵町','添田町','田川市','大刀洗町','太宰府市','筑後市','筑紫野市','築上町','筑前町','東峰村','那珂川市',
            '中間市','直方市','久山町','広川町','福岡市','福智町','福津市','豊前市','水巻町','みやこ町','みやま市','宮若市','宗像市','柳川市','八女市','行橋市','吉富町'],

        // 佐賀県
        ['有田町','伊万里市','嬉野市','大町町','小城市','鹿島市','上峰町','唐津市','神埼市','基山町','玄海町','江北町','佐賀市','白石町','多久市','武雄市','太良町','鳥栖市','みやき町','吉野ヶ里町'],

        // 長崎県
        ['壱岐市','諫早市','雲仙市','大村市','小値賀町','川棚町','五島市','西海市','佐々町','佐世保市','島原市','新上五島町','対馬市','時津町','長崎市','長与町','波佐見町','東彼杵町','平戸市','松浦市','南島原市'],

        // 熊本県
        ['あさぎり町','芦北町','阿蘇市','天草市','荒尾市','五木村','宇城市','宇土市','産山村','大津町','小国町','嘉島町','上天草市','菊池市','菊陽町','玉東町','球磨村','熊本市','甲佐町','合志市','相良村','高森町',
            '玉名市','多良木町','津奈木町','長洲町','和水町','南関町','錦町','西原村','氷川町','人吉市','益城町','美里町','水上村','水俣市','南阿蘇村','南小国町','御船町','八代市','山江村','山鹿市','山都町','湯前町','苓北町'],

        // 大分県
        ['宇佐市','臼杵市','大分市','杵築市','玖珠町','国東市','九重町','佐伯市','竹田市','津久見市','中津市','日出町','日田市','姫島村','豊後大野市','豊後高田市','別府市','由布市'],

        // 宮崎県
        ['綾町','えびの市','門川町','川南町','木城町','串間市','国富町','小林市','五ヶ瀬町','西都市','椎葉村','新富町','高千穂町','高鍋町','高原町','都農町','西米良村','日南市','延岡市','日之影町','日向市','美郷町','三股町','都城市','宮崎市','諸塚村'],

        // 鹿児島県
        ['姶良市','阿久根市','伊佐市','出水市','いちき串木野市','指宿市','大崎町','鹿児島市','鹿屋市','肝付町','霧島市','錦江町','薩摩川内市','さつま町','志布志市','曽於市','垂水市','中種子町','長島町','西之表市','日置市','東串良町',
            '枕崎市','三島村','南大隅町','南九州市','南さつま市','南種子町','屋久島町','湧水町','天城町','奄美市','伊仙町','宇検村','喜界町','瀬戸内町','龍郷町','知名町','徳之島町','十島村','大和村','与論町','和泊町'],

        // 沖縄県
        ['粟国村','伊江村','伊是名村','糸満市','伊平屋村','浦添市','うるま市','大宜味村','沖縄市','恩納村','嘉手納町','北中城村','金武町','宜野座村','宜野湾市','国頭村','久米島町','座間味村','北谷町','渡嘉敷村','渡名喜村','豊見城市','中城村','今帰仁村',
            '名護市','那覇市','南城市','西原町','南風原町','東村本部町','八重瀬町','与那原町','読谷村','北大東村','南大東村','多良間村','宮古島市','石垣市','竹富町','与那国町'],
    ];

        // 47都道府県を配列に格納
    const ken = ["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県",
                    "埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県",
                    "岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県",
                    "鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県",
                    "佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"];

        // htmlとの連携
    const accordionContainer = document.getElementById('accordion-container');//アコーディオン画面
        //▶(はりぼて)を付けるために変数に格納している(押しても▼になることはないためなくても平気)
    var mark = '▶';//※消す場合は309行目のmark変数も消すこと
        
        // アコーディオンを作成する関数
    function createAccordion(title, items) {;
        const accordion = document.createElement('div');
        accordion.classList.add('accordion');
        accordion.id ="destination-list";
            
            // 北海道、青森県・・・のようアコーディオンにタイトルを付けている
        const header = document.createElement('div');
        header.textContent = title;
        header.id = `header-${title}`;
        header.className = "destination-header";
            // console.log(title);
        const content = document.createElement('div');
        const accordion1 = document.createElement('div');
        content.id = `content-${title}`;
        content.classList.add('content');
        content.style.display = 'none';//アコーディオンを開くための設定

            // アコーディオン全体のチェックボックス(アコーディオンの横にくるチェックボックス)
        const allCheckbox = document.createElement('input');
        allCheckbox.type = 'checkbox';
        allCheckbox.id = `allCheckbox-${title}`;
        allCheckbox.className ="destination-allCheckbox";
            // console.log(allCheckbox.id);
            
            // アコーディオン全体のチェックボックスのイベントリスナー
        allCheckbox.addEventListener('change', () => {
            const checkboxes = content.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = allCheckbox.checked;
                    // 全体のチェックボックスが切り替えられた時にラベルの背景色も切り替える
                    const label = checkbox.nextElementSibling;
                    label.style.backgroundColor = checkbox.checked ? '#c5fbff' : '';
                }
            );
        });
            
            // 画面表示するためにクラスに追加している
        accordion.appendChild(header);
        accordion.appendChild(allCheckbox); //ヘッダーの後に追加
        accordion.appendChild(content);
            // accordionContainer.appendChild(document.createElement('br')); //改行(入れることで北海道、青森県・・・の間に改行が入る)
        accordionContainer.appendChild(accordion);
        accordionContainer.appendChild(accordion1);

        //アコーディオンの中のチェックボックス作成
        let itemCount = 0;
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row'); // 行用のdiv
        content.appendChild(rowDiv);
        
        items.forEach(item => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = item;
            checkbox.id = `checkbox-${item}`;

            const label = document.createElement('label');
            label.htmlFor = `checkbox-${item}`;
            label.id = `checkbox2`;
            label.textContent = item;

            // checkboxのクリックでlabelの背景色を切り替える処理
            checkbox.addEventListener('change', () => {
                label.style.backgroundColor = checkbox.checked ? '#c5fbff' : '';
            });

            // 5つごとに新しい行を作る
            if (itemCount % 4 === 0 && itemCount !== 0) {
                const newRowDiv = document.createElement('div');
                newRowDiv.classList.add('row');
                content.appendChild(newRowDiv);
            }

            const currentRow = content.lastChild;
            currentRow.appendChild(checkbox);
            currentRow.appendChild(label);

            itemCount++;
        });
            // アコーディオンが押されたときの処理
        header.addEventListener('click', () => {
            content.style.display = content.style.display === 'none' ? 'block' : 'none';//開閉の処理
            header.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
            header.style.transition = 'transform 0.3s';
        });    
        accordionContainer.appendChild(accordion);
    }

    // 二次元配列をループしてアコーディオンを作成
    data.forEach((items, index) => {
    createAccordion(mark+ken[index], items);
    });


}