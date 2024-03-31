// ページが読み込まれたときとウィンドウサイズが変更されたときに高さを調整
function adjust_header_height() {
    const header_height = document.querySelector("#bool").offsetHeight;
    const end_height = document.querySelector("fotter").offsetHeight;
    // 現在のビューポートの高さを取得
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    document.querySelector(".regular_body").style.height = viewportHeight - header_height - end_height + "px";
    const regular_menu = document.querySelector(".regular_menu");
    document.querySelector(".regular_site").style.paddingTop = header_height + "px";
    document.querySelector(".regular_site").style.paddingBottom = end_height + "px";
    regular_menu.style.marginTop = header_height + "px";
    // end_heightを引いてregular_menuの高さを調整
    regular_menu.style.height = `calc(100% - ${header_height + end_height}px)`;
}


// ページ読み込み時とウィンドウサイズ変更時に高さを調整
window.addEventListener("load", adjust_header_height);
window.addEventListener("resize", adjust_header_height);

$(function () {
  $('.regular_hamburger').click(function () {
      $('.regular_hamburger').toggleClass('active');
      $('.regular_menu').toggleClass('open');
      
      // class="regular_hamburger_text" のテキストを変更
      var hamburgerText = $('.regular_hamburger_text');
      if (hamburgerText.text() === "MENU") {
          // MENUのテキストの時にbodyにスクロール属性を追加
          $('body').css('overflow-y', 'hidden');
          hamburgerText.text("CLOSE");
      } else {
          // CLOSEのテキストの時にbodyのスクロール属性を削除
          $('body').css('overflow-y', 'auto');
          hamburgerText.text("MENU");
      }
  });
});

//サイト切り替えボタンが押された場合に発火.
$(document).ready(function () {
  $(".switch_btn").click(function () {
      // 正規サイトとFalseサイトの表示を切り替える
      $(".regular_site, .false_site").toggle();
      var toggle_text = $('.switch_btn_txt');
      var header_text = $('.regular_titile_highlight');
      if (toggle_text.text() === "正規サイトに切り替える") {
        toggle_text.text("偽サイトに切り替える");
        header_text.text("正規サイト");
      } else {
        toggle_text.text("正規サイトに切り替える");
        header_text.text("偽サイト");
      }
  });
});

// 既存の×を削除する関数
function removeX() {
    const existingX = document.querySelector('.result');
    if (existingX) {
      existingX.remove();
    }
  }

  // 任意の場所に×を表示する関数
  function showX(event) {
    const clickedElement = event.target;

    // クリックされた要素が 'result' クラスを持っている場合は何もしない
    if (clickedElement.classList.contains('result')) {
      return;
    }

    // クリックされた要素が特定のデータを持っていない場合も何もしない
    const specialData = clickedElement.getAttribute('data-special');
    if (specialData == null) {
      return;
    }

    // 既存の×があれば削除
    removeX();

    const x = event.pageX -20;
    const y = event.pageY - 27;
    const xElement = document.createElement('div');
    xElement.className = 'result';
    xElement.textContent = '〇';
    xElement.style.top = y + 'px';
    xElement.style.left = x + 'px';
    document.body.appendChild(xElement);

    // 2秒後に×を消す
    setTimeout(() => {
      xElement.remove();
    }, 500);
  }

  // ページが読み込まれたときの処理
  document.addEventListener('DOMContentLoaded', function () {
    // 任意の場所をクリックしたときの処理
    document.addEventListener('click', showX);
  });
