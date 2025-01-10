"use client";

import $ from "jquery";
export default function initializeScripts() {
  if (typeof window !== "undefined" && typeof window.jQuery !== "undefined") {
    $(document).ready(() => {
      console.log("jQuery is ready");
    });
  } else {
    console.error("jQuery is not loaded or not defined.");
  }

//loader
// jQuery(document).ready(function($) {
//     var checkWfActive = setInterval(function() {
//       if ($('html').hasClass('wf-active')) {
//         // wf-activeが付与されたらクラスを追加
//         $('.loader-wrapper').addClass('animate');
//         clearInterval(checkWfActive); // チェックを止める
//       }
//     }, 100); // 100ms間隔でチェック
//   });
  
  
  
  // $(".works-slider-next").on("click", function () {
  //   ($ as any)(".works_articles-slider").slick("slickNext"); // 次のスライドに移動
  // });

  // FV文字アニメーション
  // jQuery(function ($) {
  //   //ページ読み込み時に実行したい処理
  //   window.onload = function() {
      
  //     $('.animate').each(function() {
  //       $(this).addClass('show');
  //       })
  //   };
  //   $('.animate').each(function() {
  //     $(this).delay(1000).queue(function(){
  //       $(this).addClass('show');
       
  //   });
  //     })
  //   });
  
  
  // playボタンホバー
  // jQuery(function ($) {
  //     $('#play').hover(
  //       function() {
            
  //           //マウスカーソルが重なった時の処理
  //           $(this).find('img').attr('src', 'asset/img/header_main-play-R.png');
  //           $(this).addClass('animate');
  //       },
  //       function() {
            
  //           //マウスカーソルが離れた時の処理
  //           $(this).find('img').attr('src', 'asset/img/header_main-play.png');
  //           $(this).removeClass('animate');
  //       }
  //   );
  // });
  
  // sustainロゴ出現
  

  $(function () {
    $(window).on('scroll resize', function () {
      const setHeight = 100; // 設定した高さ
      const wHeight = $(window).height() || 0; // ウィンドウの高さ (undefined対応)
      const scrollTop = $(window).scrollTop() || 0; // ページの上からスクロールされた分 (undefined対応)
  
      $('.animate-ttl').each(function () {
        const targetPosition = $(this).offset()?.top || 0; // offsetがundefinedの場合に対応
        if (scrollTop > targetPosition - wHeight + setHeight) {
          $(this).addClass('show');
        }
      });
    });
  });
  
   // ハンバーガー
  
  // jQuery(function ($) {
  //   $('.fixed_hmg').click(function() {
  //    $(this).toggleClass('active');
  //    $('.fixed_global-nav').toggleClass('active');
  // })
  
  // });
  
   // ハンバーガー
  //  jQuery(function ($) {
  //   if (window.matchMedia("(max-width: 768px)").matches) {
  //     // $('.dropdown-items').hide();
  //     $('.slide-button').each(function() {
  //       $(this).click(function() {
  //         $(this).next('.dropdown-items').toggleClass('active');
  //         $(this).toggleClass('active');
  //       })
  //     })
    
  //   } 
   
  
  // });
  
  // ビデオ再生・停止
  // $(function () {
  //   $(".header_main-play").on("click", function () {
  //     const videoElement = $(".fixed_view-video video")[0] as HTMLVideoElement; // HTMLVideoElement にキャスト
  
  //     if (videoElement.paused) {
  //       videoElement.play();
  //     } else {
  //       videoElement.pause();
  //     }
  //   });
  // });
  
  // // アンカーリンク
  // $(function () {
  //   $('a[href^="#"]').on("click", function (event) {
  //     event.preventDefault(); // デフォルトのリンク動作を無効化
  
  //     const speed = 600; // スクロール速度
  //     const href = $(this).attr("href"); // href 属性を取得
  
  //     // href が undefined の場合のチェック
  //     if (!href || href === "#") {
  //       return;
  //     }
  
  //     // href を元にターゲットを取得
  //     const target = $(href === "#" || href === "" ? "html" : href);
  
  //     // offset() のチェックとスクロール位置の計算
  //     const position = target.offset()?.top ?? 0;
  
  //     // スムーズスクロール
  //     $("html, body").animate({ scrollTop: position }, speed, "swing");
  //   });
  // });
  
  // ビデオぼかし
  
  $(function () {
    $(window).on("scroll resize", function () {
      const setHeight = 500; // 設定した高さ
      const wHeight = $(window).height() ?? 0; // ウィンドウの高さ
      const scrollTop = $(window).scrollTop() ?? 0; // ページの上からスクロールされた分
  
      const targetPosition = $("#about").offset()?.top; // 対象要素と画面上部までの距離
  
      // targetPosition が undefined の場合は処理をスキップ
      if (typeof targetPosition !== "number") {
        return;
      }
  
      if (scrollTop > targetPosition - wHeight / 2) {
        $(".fixed_view-video").addClass("animate");
      } else {
        $(".fixed_view-video").removeClass("animate");
      }
    });
  });
     // サステナブル枠線移動
     $(function () {
      if (window.matchMedia("(max-width: 768px)").matches) {
        $(window).on("scroll resize", function () {
          const wHeight = $(window).height() ?? 0; // ウィンドウの高さ
          const setHeight = wHeight * 0.2; // 設定した高さ
          const scrollTop = $(window).scrollTop() ?? 0; // ページの上からスクロールされた分
    
          $(".sustain_child").each(function () {
            const targetPosition = $(this).offset()?.top; // 対象要素と画面上部までの距離
    
            if (typeof targetPosition !== "number") {
              return;
            }
    
            if (scrollTop > targetPosition - wHeight + setHeight) {
              $(this).find(".move-line").addClass("animate");
            } else {
              $(this).find(".move-line").removeClass("animate");
            }
          });
        });
      } else {
        $(window).on("scroll resize", function () {
          const wHeight = $(window).height() ?? 0; // ウィンドウの高さ
          const setHeight = wHeight * 0.5; // 設定した高さ
          const scrollTop = $(window).scrollTop() ?? 0; // ページの上からスクロールされた分
    
          $(".sustain_child").each(function () {
            const targetPosition = $(this).offset()?.top; // 対象要素と画面上部までの距離
    
            if (typeof targetPosition !== "number") {
              return;
            }
    
            if (scrollTop > targetPosition - wHeight + setHeight) {
              $(this).find(".move-line").addClass("animate");
            } else {
              $(this).find(".move-line").removeClass("animate");
            }
          });
        });
      }
    });
   
    // プロフィール出現
    $(function () {
      $(window).on("scroll resize", function () {
        const wHeight = $(window).height() ?? 0; // ウィンドウの高さ
        const setHeight = wHeight * 0.2; // 設定した高さ
        const scrollTop = $(window).scrollTop() ?? 0; // ページの上からスクロールされた分
    
        $(".sustain_child").each(function (i) {
          const targetPosition = $(this).offset()?.top; // 対象要素と画面上部までの距離
    
          if (typeof targetPosition !== "number") {
            return;
          }
    
          if (scrollTop > targetPosition - wHeight + setHeight) {
            $(".profile").removeClass("animate"); // 他の要素からクラスを削除
            $(".profile").eq(i).addClass("animate"); // 現在の要素にクラスを追加
          }
        });
      });
    });
    
  // topicクリック
  // jQuery(function ($) {
  //   $('.topic-category').each(function(i) {
  //     $(this).click(function (){
  //       $('.topic-category').removeClass('active');
  //       $(this).addClass('active');
  
  //     });
  // });
  // });

}
