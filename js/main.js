// 待機関数
function wait(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
}


// 文字列の数を返す関数　半角文字数は1文字、全角文字数は2文字として考える。
function count(str) {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
    (str[i].match(/[ -~]/)) ? len += 1 : len += 2;
    }
    return len;
}

// メッセージ待機用の配列
let message_array = [];
// 初めのメッセージかどうか
let message_first_flg = true;




// メッセージを追加する関数　message:メッセージ内容の文字列, from:「enemy」か「me」を文字列で書いてください。enemyと書いた場合は相手側となり、meと書いた場合は自分側のメッセージとなります。
async function add_message() {
    while (message_array.length == 0) {
        await wait(100);
    }
    // show_pop_up関数を呼び出されている場合
    if (message_array[0][0] == "show_pop_up") {
        await wait(1000);

        // 次へ進むボタンの生成
        let make_next_btn = document.createElement("button");
        make_next_btn.id = "next_btn";
        make_next_btn.textContent = "次へ進む";
        make_next_btn.setAttribute('value', message_array[0][1]);
        make_next_btn.setAttribute('onclick', 'show_pop_up(this.getAttribute("value"))');
        document.getElementById("page_footer").appendChild(make_next_btn);
        make_next_btn.className = "blur next2";
        return;
    }

    let message = message_array[0][0];
    let from = message_array[0][1];
    
    // メッセージ初期表示時間（ランダム）
    var items = [0.5, 1, 1.5];
    //最大値は配列の「要素数」にする
    var random = Math.floor( Math.random() * items.length );
    if (message_first_flg) {  // 初めのメッセージは待機無し
        message_first_flg = false;
    }else {
        await wait(items[random]*1000);
    }
    

    // 初期表示開始
    let div_tag = document.createElement("div");
    if (from == "me"){
        div_tag.className = "message_block message_me";
    }else {
        div_tag.className = "message_block";
    }
    // 人のアイコン作成
    let parson_tag = document.createElement("div");
    parson_tag.className = "person_mark";
    let parson_head = document.createElement("span");
    parson_head.className = "person_mark_head";
    let parson_body = document.createElement("span");
    parson_body.className = "person_mark_body";
    parson_tag.appendChild(parson_head);
    parson_tag.appendChild(parson_body);
    div_tag.appendChild(parson_tag);
    // 名前作成
    let name_p_tag = document.createElement("p");
    name_p_tag.className = "parson_name";
    if (from == "me"){
        name_p_tag.innerText = "自分";
    }else {
        name_p_tag.innerText = "相手";
    }
    div_tag.appendChild(name_p_tag);

    // メッセージ作成
    let p_tag = document.createElement("p");
    p_tag.className = "message_content loading_anime";
    p_tag.innerHTML = "<span></span><span></span><span></span>";
    div_tag.appendChild(p_tag);

    document.getElementById("bulletin_board").appendChild(div_tag);

    if (from == "enemy"){
        await wait(30*count(message));

    }
    // メッセージ内容追加
    div_tag.getElementsByClassName("message_content")[0].className = "message_content";
    div_tag.getElementsByClassName("message_content")[0].textContent = message;
    // 時間追加
    var now_time = moment();
    let posted_date_tag = document.createElement("p");
    posted_date_tag.className = "posted_date";
    posted_date_tag.textContent = now_time.format('YYYY/MM/DD HH:mm');
    div_tag.appendChild(posted_date_tag);
    
    // 配列からメッセージ削除
    message_array.shift();

    // スクロール
    const sc = document.getElementsByTagName("main")[0];
    sc.scrollTop = sc.scrollHeight;

    add_message();

}


async function show_pop_up(content_str) {
    // 文字列からJSON型に変換
    let content = JSON.parse(content_str);  
    // 次へ進むボタンが設置されていれば削除
    if (document.getElementById("next_btn")) {
        document.getElementById("next_btn").remove();
    }

    // テキストリセット
    document.getElementsByClassName("control")[0].getElementsByTagName("h3")[0].innerHTML = '<span id="ityped"></span>';
    // ボタン非表示
    document.getElementsByClassName("choice")[0].className = "choice";
    document.getElementsByClassName("choice")[0].style.display = "none";

    if (content["genre"] == "質問") {
        // ボタン表示
        document.getElementsByClassName("choice")[0].style.display = "flex";
        // ボタンの内容を変更
        document.getElementsByClassName("choice")[0].getElementsByTagName("button")[0].innerText = content["button1_txt"];
        document.getElementsByClassName("choice")[0].getElementsByTagName("button")[1].innerText = content["button2_txt"];
        // ボタンが押された際の処理
        let ans = content["correct_answer"];
        let btn_1 = "no"
        let btn_2 = "no"
        if (ans == 1) {
            btn_1 = "yes";
        }else {
            btn_2 = "yes";
        }

        document.getElementsByClassName("choice")[0].getElementsByTagName("button")[0].setAttribute('value', '{"genre":"答え合わせ", "message":"'+content["btn1_content"]+'", "ans":"'+btn_1+'"}');
        document.getElementsByClassName("choice")[0].getElementsByTagName("button")[0].setAttribute('onclick', 'show_pop_up(this.getAttribute("value"))');
        document.getElementsByClassName("choice")[0].getElementsByTagName("button")[1].setAttribute('value', '{"genre":"答え合わせ", "message":"'+content["btn2_content"]+'", "ans":"'+btn_2+'"}');
        document.getElementsByClassName("choice")[0].getElementsByTagName("button")[1].setAttribute('onclick', 'show_pop_up(this.getAttribute("value"))');

        // ボタンのdisplayをflexに変更
        document.getElementsByClassName("choice")[0].style.display = "flex";
    }
    
    // ポップアップ表示
    document.getElementsByClassName("pop_up")[0].style.display = "flex";
    document.getElementsByClassName("pop_up")[0].className = "pop_up blur";
    // テキスト表示
    if (content["genre"] == "質問") {
        ityped.init(document.querySelector("#ityped"), { strings: [content["message"]], loop: false });
        await wait("2000");
        document.getElementsByClassName("choice")[0].className = "choice blur";
    }else if(content["genre"] == "答え合わせ") {
        if (window.location.href.split('/').pop() == "message.html") {
            document.getElementsByClassName("control")[0].innerHTML += '<button id="next_btn" class="" onclick="location.href='+ "'"+"message2.html"+"'"+ '">次の体験へ進む</button>'
        }else if (window.location.href.split('/').pop() == "message2.html") {
            document.getElementsByClassName("control")[0].innerHTML += '<button id="next_btn" class="" onclick="location.href='+ "'"+"message3.html"+"'"+ '">次の体験へ進む</button>'
        }else if (window.location.href.split('/').pop() == "message3.html") {
            document.getElementsByClassName("control")[0].innerHTML += '<button id="next_btn" class="" onclick="location.href='+ "'"+"top.html"+"'"+ '">終了</button>'
        }
        document.getElementById("next_btn").style.display = "none";
        if (content["ans"] == "yes") {
            document.getElementById("ityped").textContent = "○";
            document.getElementById("ityped").style = "font-size: 158px!important;font-family: monospace; color: #21e57f;";
        }else {
            document.getElementById("ityped").textContent = "×";
            document.getElementById("ityped").style = "font-size: 158px!important;font-family: monospace; color: #e52123;";
        }

        await wait(1000);
        document.getElementById("next_btn").style.display = "inline";
        document.getElementById("ityped").textContent = ""
        document.getElementById("ityped").style = "";
        
        ityped.init(document.querySelector("#ityped"), { strings: [content["message"]], loop: false });
        while (document.getElementById("ityped").textContent != content["message"]) {
            await wait(100);
        }
        await wait(800);
        document.getElementById("next_btn").className = "blur";
    }
    
}