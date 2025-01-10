"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import "../public/asset/css/style.css";
import Head from "next/head";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from 'react-i18next';
// import { hydrateRoot } from "react-dom/client";
import i18n from "../i18n";
// Postの型定義
interface Post {
  id: number;
  date: string;
  title: string;
  content: string;
  flyer_image: string | null; // 画像がない場合も許容
  location_name: string;
}
declare global {
  interface Window {
    Typekit?: {
      load: (config: { kitId: string; scriptTimeout: number; async: boolean }) => void;
    };
  }
}
i18n.init({
  lng: "ja", // デフォルトの言語
  fallbackLng: "en", // フォールバックの言語
});
export default function HomePage() {

  const [isClient, setIsClient] = useState(false);// クライアントサイド確認用
  const { i18n, t } = useTranslation("common"); // 翻訳キーを参照

  const changeLanguage = (lng: string) => {
    if (isClient) {
      i18n.changeLanguage(lng); // 言語切り替え
    }
  };

  const sliderSettings = {
    infinite: true,
    autoplay: true,//自動でスライドさせる
    autoplaySpeed: 0,//次の画像に切り替えるまでの時間 今回の場合は0
    speed: 10000,//画像が切り替わるまでの時間 今回の場合は何秒で1枚分動くか
    cssEase: 'linear',//動きの種類は等速に
    arrows: false,//左右に出る矢印を非表示
    swipe: false,//スワイプ禁止
    pauseOnFocus: false,//フォーカスが合っても止めない
    pauseOnHover: false,//hoverしても止めない
    centerMode: true,//一枚目を中心に表示させる
    initialSlide: 3,//最初に表示させる要素の番号を指定
    variableWidth: true,//スライドの要素の幅をcssで設定できるようにする
    useTransform: false,
    responsive: [
      {
        breakpoint: 500,
        settings: {
          autoplay: false,
          swipe: true,
          slidesToScroll: 1,
          speed:300,
          arrows:true,
        }
      },

    ]
  };
  const sliderRef = useRef<Slider | null>(null);
  const sliderSettings2 = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }

    ]
  };
  // スライダー「次へ」ボタン
  const handleNextClick = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };
  const [isShow, setIsShow] = useState(false); // showクラスの状態を管理
  const [isAnimate, setIsAnimate] = useState(false); // showクラスの状態を管理
  const playRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [imgSrc, setImgSrc] = useState("/asset/img/header_main-play.png");
  const [isAnimate2, setIsAnimate2] = useState(false);
  const [isVideoAnimated, setIsVideoAnimated] = useState(false);
  const [animateTtls, setAnimateTtls] = useState<boolean[]>([]);
  const [activeProfiles, setActiveProfiles] = useState<number | null>(null);
  const videoRef2 = useRef<HTMLDivElement>(null);
  const [animatedMoveLines, setAnimatedMoveLines] = useState<boolean[]>([]);

  const [posts, setPosts] = useState<Post[]>([]); // 型指定

  const formatContent = (content: string) => {
    return content.split(/\r?\n/).map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };
  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/posts/latest`);
      if (!response.ok) {
        console.error("Error fetching posts:", response.status, response.statusText);
        return;
      }
      const data: Post[] = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
    fetchPosts();

    if (typeof window === "undefined") return;
    //Adobe fonts
    const loadTypekit = () => {
      const config = {
        kitId: "fck1mst",
        scriptTimeout: 3000,
        async: true,
      };

      const htmlElement = document.documentElement;
      const timeoutId = setTimeout(() => {
        htmlElement.className = htmlElement.className.replace(/\bwf-loading\b/g, "") + " wf-inactive";
      }, config.scriptTimeout);

      const typekitScript = document.createElement("script");
      const firstScript = document.getElementsByTagName("script")[0];

      htmlElement.className += " wf-loading";
      typekitScript.src = `https://use.typekit.net/${config.kitId}.js`;
      typekitScript.async = true;

      // スクリプト読み込み成功時の処理
      typekitScript.addEventListener("load", () => {
        clearTimeout(timeoutId);
        try {
          window.Typekit?.load(config); // 型エラーは発生しません
        } catch (e) {
          console.error("Typekit load error:", e);
        }
      });

      // スクリプト読み込みエラー時の処理
      typekitScript.addEventListener("error", () => {
        clearTimeout(timeoutId);
        console.error("Failed to load Typekit script");
      });

      if (firstScript?.parentNode) {
        firstScript.parentNode.insertBefore(typekitScript, firstScript);
      }
    };

    loadTypekit();

    // ローディングアニメーションとアニメーション表示処理

    const checkWfActive = setInterval(() => {
      if (document.documentElement.classList.contains("wf-active")) {
        setIsShow(true); // wf-activeが確認できたらshow状態を有効に
        setIsAnimate(true); // wf-activeが確認できたらshow状態を有効に
        clearInterval(checkWfActive); // インターバルを解除
        clearTimeout(timeoutLoad); // タイムアウトを解除
      }
    }, 100);

    // タイムアウト処理 (1分 = 60,000ms)
    const timeoutLoad = setTimeout(() => {
      setIsShow(true); // 強制的にshow状態を有効に
      setIsAnimate(true); // 強制的にanimate状態を有効に
      clearInterval(checkWfActive); // インターバルを解除
    }, 5000);

    // `#play` の hover 処理
    const playElement = playRef.current;
    const videoElement = videoRef.current;

    if (!playElement || !videoElement) return;

    const handleMouseEnter = () => {
      setImgSrc("/asset/img/header_main-play-R.png");
      setIsAnimate2(true);
    };

    const handleMouseLeave = () => {
      setImgSrc("/asset/img/header_main-play.png");
      setIsAnimate2(false);
    };

    const handleClick = () => {
      if (videoElement.paused) {
        videoElement.play();
      } else {
        videoElement.pause();
      }
    };

    playElement.addEventListener("mouseenter", handleMouseEnter);
    playElement.addEventListener("mouseleave", handleMouseLeave);
    playElement.addEventListener("click", handleClick);


    // アンカーリンクのスムーズスクロール処理
    const anchorLinks = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');

    const handleAnchorClick = (event: MouseEvent) => {
      event.preventDefault();

      const target = event.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute("href");

      if (!href || href === "#") {
        // ページの先頭に移動
        document.documentElement.scrollIntoView({ behavior: "smooth" });
        return;
      }

      const scrollToElement = document.querySelector<HTMLElement>(href);
      if (scrollToElement) {
        // スムーズスクロール
        scrollToElement.scrollIntoView({ behavior: "smooth" });
      } else {
        console.warn(`No element found for href: ${href}`);
      }
    };

    anchorLinks.forEach((link) => link.addEventListener("click", handleAnchorClick));

    // スクロールとリサイズイベントの処理
    const handleScrollResize = () => {
      const wHeight = window.innerHeight;
      const setHeight = 100;

      // animate-ttlのアニメーション状態を管理
      const ttlElements = document.querySelectorAll<HTMLElement>(".animate-ttl");
      const ttlStates = Array.from(ttlElements).map((element) => {
        const targetPosition = element.getBoundingClientRect().top;
        return targetPosition < wHeight - setHeight;
      });
      setAnimateTtls(ttlStates);

      // 動画アニメーションの制御
      const aboutElement = document.getElementById("about");
      if (aboutElement && videoRef2.current) {
        const targetPosition = aboutElement.getBoundingClientRect().top;
        setIsVideoAnimated(targetPosition < wHeight / 2);
      }

      // move-lineのアニメーション状態を管理
      const sustainChildren = document.querySelectorAll<HTMLElement>(".sustain_child");
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const sustainSetHeight = isMobile ? wHeight * 0.2 : wHeight * 0.5;

      const moveLineStates: boolean[] = Array.from(sustainChildren).map((child) => {
        const targetPosition = child.getBoundingClientRect().top;
        return targetPosition < wHeight - sustainSetHeight;
      });
      setAnimatedMoveLines(moveLineStates);

      // プロフィールのアニメーション状態を管理
      let activeIndex: number | null = null;
      sustainChildren.forEach((child, index) => {
        const targetPosition = child.getBoundingClientRect().top;
        if (targetPosition < wHeight - sustainSetHeight) {
          activeIndex = index;
        }
      });
      setActiveProfiles(activeIndex);
    };

    window.addEventListener("scroll", handleScrollResize);
    window.addEventListener("resize", handleScrollResize);


    return () => {
      clearInterval(checkWfActive);
      clearTimeout(timeoutLoad);
      anchorLinks.forEach((link) => link.removeEventListener("click", handleAnchorClick));
      window.removeEventListener("scroll", handleScrollResize);
      window.removeEventListener("resize", handleScrollResize);
      playElement.removeEventListener("mouseenter", handleMouseEnter);
      playElement.removeEventListener("mouseleave", handleMouseLeave);
      playElement.removeEventListener("click", handleClick);
    };



  }, [playRef, videoRef, fetchPosts]);

  return (
    <>
      <Head>
        {/* その他SEO用メタタグ */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
      </Head>

      <div className={`loader-wrapper ${isAnimate ? "animate" : ""}`}>
        <div className="loader"></div>
      </div>
      <Link href="/" className="fixed_logo">
        <Image src="/asset/img/header_logo.png" alt="ロゴ画像" />
      </Link>
      <div className="fixed_view">
        <div className={`fixed_view-video ${isVideoAnimated ? "animate" : ""}`}
          ref={videoRef2}>
          <video
            loop
            muted
            autoPlay
            playsInline
            ref={videoRef}
            src="/asset/img/My Fast Short Songs Are Stacked State.mp4"
          ></video>
        </div>
      </div>
      <nav className="fixed_nav">
        <ul className="fixed_nav-jpLinks">
          <li className="contact">
            <a onClick={() => changeLanguage('ja')}>
              <div className="span-wrapper">
                <span className="top">日本語</span>
                <span className="bottom">日本語</span>
              </div>
            </a>
          </li>
          <li className="line"></li>
          <li className="document">
            <a onClick={() => changeLanguage('en')}>
              <div className="span-wrapper">
                <span className="top">English</span>
                <span className="bottom">English</span>
              </div>
            </a>
          </li>
        </ul>
      </nav>
      {/* <!-- header --> */}
      <header>
        <nav className="header_nav">
          <Link href="#" className="header_logo">
            <Image src="/asset/img/header_logo.png" alt="ロゴ画像" />
          </Link>
          <ul className="header_anchor-links">
            <li className="header_anchor-links__item mega-button">
              <Link href="#about"><p className="acmin">ABOUT</p></Link>
            </li>
            <li className="header_anchor-links__item mega-button">
              <Link href="#sustain"><p className="acmin">MEMBERS ARE</p></Link>
            </li>
            <li className="header_anchor-links__item">
              <Link href="#works" className="acmin">YOUTUBE</Link>
            </li>
          </ul>
        </nav>
        <div className={`header_main ${isShow ? "show" : ""}`} id="header_main">
          <div className="inner_container">
            <h1 className="header_main-ttl acmin">
              My Fast Short Songs Are <br />
              <span>Stacked State</span>
            </h1>
            <div className="header_main-topics">
              <p className="ttl hologen">NOW ON SALE!!</p>
              <p className="excerpt">&quot;37 Tracks E.P.&quot;CD - MCR Web Shop</p>
              <Link target="_blank" href="https://mcrwebshop.com/?pid=177414003" className="permalink">
                <Image src="/asset/img/viewMore-arrowS.svg" alt="リンク" />
              </Link>
            </div>
          </div>
          <div className={`header_main-play ${isAnimate2 ? "animate" : ""}`} id="play" ref={playRef}>
            <Image src={imgSrc} alt="play" />
          </div>
        </div>
      </header>
      {/* <!-- main --> */}
      <main>
        {/* <!-- section about --> */}
        <section className="about">
          <div className="inner_container">
            <div className="about-pickUp">
              <div className="about-pickUp__ttl">
                <h2><p className="jp">
                  {formatContent(t('live_info'))}
                  {/* ライブ情報 */}
                </p></h2>
                <p className="eng hologen">GIG INFO</p>
              </div>
              <ul className="about-pickUp__articles">
                {posts.map((post) => (
                  <li key={post.id} className="about-pickUp__articles-item">
                    <h3>{post.title}</h3>
                    <time className="acmin" dateTime={post.date}>{post.date}</time>
                    <div className="locate">{post.location_name}</div>
                    <div className="content">{formatContent(post.content)}</div>
                    {post.flyer_image && (
                      <Image src={`https://stackedstate.com/storage/${post.flyer_image}`} alt={`${post.title}のフライヤー`} />
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div id="about" className="about-main">
              <div className="about-main__left">
                <h2 className="eng hologen">ABOUT</h2>
                <p className="desc">
                  {/* 僕の速くて短い曲は<br />
                  積み重ねられた状態です */}
                  {formatContent(t('catchphrase'))}
                </p>
              </div>
              <div className="about-main__right">
                <p className="desc">
                  {formatContent(t('about'))}
                  {/* 2017年秋、四宮立（Dr)と対バンで出会ったばったん(Gt.)の二人で結成。<br /><br />
                  2021年に活動場所の一つであるライブハウス「茨木アナーキー」店主いたさんがベースで加入。<br />
                  歌って踊れる３人組ハードコアアイドルとして大阪を中心に活動中。<br /><br />
                  2019年にはStackedState初のツアーにして初の海外ツアー「Stacked
                  State 日本人仕事中毒旅行 in 東南アジア」を敢行。<br />
                  初日の飛行機に乗り遅れるという大失態を犯しながらも大盛況の中成功を収める。<br /><br />
                  現状は、四宮立の別プロジェクト「ni.(エヌアイ)」の曲と四宮立の持ち曲を演奏している。<br />
                  ただ、２０年以上に及ぶ持ち曲の数が多すぎるので、Stacked
                  Stateとしてのオリジナル曲は未だないまま１００曲にも及ぶ四宮曲の消化に終われる日々を送っている。 */}
                </p>
              </div>
            </div>
          </div>
          <div className="about-slider">
            <ul className="slider">
              <Slider {...sliderSettings}>
                <li className="item item1">
                  <Image src="/asset/img/about-slider_img1.jpg" alt="スライダー画像" />
                </li>
                <li className="item item2">
                  <Image src="/asset/img/about-slider_img2.jpg" alt="スライダー画像" />
                </li>
                <li className="item item3">
                  <Image src="/asset/img/about-slider_img3.jpg" alt="スライダー画像" />
                </li>
                <li className="item item4">
                  <Image src="/asset/img/about-slider_img4.jpg" alt="スライダー画像" />
                </li>
                <li className="item item5">
                  <Image src="/asset/img/about-slider_img5.jpg" alt="スライダー画像" />
                </li>
                <li className="item item6">
                  <Image src="/asset/img/about-slider_img6.jpg" alt="スライダー画像" />
                </li>
                <li className="item item7">
                  <Image src="/asset/img/about-slider_img7.jpg" alt="スライダー画像" />
                </li>
              </Slider>
            </ul>
          </div>
        </section>
        {/* <!-- section sustain --> */}
        <div className="cover">
          <section id="sustain" className="sustain">
            <div className="sustain_parent">
              <div className="sustain_parent-ttl">
                <div className="outer_container">
                  <div className="sustain_parent-ttl_wrapper">
                    <div
                      className={`sustain_parent-ttl_wrapper__up animate-ttl ${animateTtls[0] ? "show" : ""
                        }`}
                    >
                      <p className="acmin">MEMBERS</p>
                    </div>
                    <div
                      className={`sustain_parent-ttl_wrapper__bottom animate-ttl ${animateTtls[1] ? "show" : ""
                        }`}
                    >
                      <p className="acmin">ARE</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="inner_container">
                <div className="sustain_stiky">
                  <div className="sustain_sticky-left">
                    <div className={` sustain_sticky-left__item profile ${activeProfiles === 0 ? "animate" : ""}`}>
                      <h2 className="eng hologen">Dr. & Vo.</h2>
                      <p className="ttl desc">
                        {/* 四宮　立 */}
                        {formatContent(t('shinomiya'))}
                      </p>
                      <p className="desc small">
                        {formatContent(t('shinomiya_profile'))}
                        {/* 好きなもの ：山田風太郎の忍法帖シリーズ<br />
                        嫌いなもの ：たばこ、調子こいてる権力者 */}
                      </p>
                      <ul className="member_icons">
                        <li className="member_icons__facebook">
                          <Link href="https://www.facebook.com/xcshdcx" target="_blank">
                            <Image src="/asset/img/facebook.png" alt="facebook" />
                          </Link>
                        </li>
                        <li className="member_icons__youtube">
                          <Link href="https://xcshdcx.wixsite.com/ryu-shinomiya" target="_blank">
                            <Image src="/asset/img/home.png" alt="home" />
                          </Link>
                        </li>
                        <li className="member_icons__x">
                          <Link href="https://x.com/spudz" target="_blank">
                            <Image src="/asset/img/x.png" alt="x" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className={`sustain_sticky-left__item profile ${activeProfiles === 1 ? "animate" : ""}`}>
                      <h2 className="eng hologen">Gt. & Vo.</h2>
                      <p className="ttl desc">
                        {/* ばったん */}
                        {formatContent(t('battan'))}
                      </p>
                      <p className="desc small">
                        {formatContent(t('battan_profile'))}
                        {/* 好きなもの ：ファイナルファンタジー<br />
                        嫌いなもの ：ヤンキー */}
                      </p>
                      <ul className="member_icons">
                        <li className="member_icons__instagram">
                          <Link href="https://www.instagram.com/paimanpsycho/" target="_blank">
                            <Image src="/asset/img/instagram.png" alt="instagram" />
                          </Link>
                        </li>
                        <li className="member_icons__facebook">
                          <Link
                            href="https://www.facebook.com/profile.php?id=100003251432034"
                            target="_blank"
                          >
                            <Image src="/asset/img/facebook.png" alt="facebook" />
                          </Link>
                        </li>
                        <li className="member_icons__x">
                          <Link href="https://x.com/otherguy0721" target="_blank">
                            <Image src="/asset/img/x.png" alt="x" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className={`sustain_sticky-left__item profile ${activeProfiles === 2 ? "animate" : ""}`}>
                      <h2 className="eng hologen">Ba. & Vo.</h2>
                      <p className="ttl desc">
                        {/* アナーキーいたさん */}
                        {formatContent(t('itasan'))}
                      </p>
                      <p className="desc small">
                        {formatContent(t('itasan_profile'))}
                        {/* 好きなもの ：タータンチェック<br />
                        嫌いなもの ：地平線 */}
                      </p>
                      <ul className="member_icons">
                        <li className="member_icons__facebook">
                          <Link
                            href="https://www.facebook.com/profile.php?id=100005817454077"
                            target="_blank"
                          >
                            <Image src="/asset/img/facebook.png" alt="facebook" />
                          </Link>
                        </li>
                        <li className="member_icons__x">
                          <Link href="https://x.com/9YVornhJUSK67m3" target="_blank">
                            <Image src="/asset/img/x.png" alt="x" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="sustain_child sustain_child1">
                    <div className="sustain_child-right">
                      <Image
                        src="/asset/img/sustain_child-right__img1.png"
                        alt="画像"
                      />
                      <svg className="sustain_child-right__circle pc_only">
                        <circle cx="256" cy="256" r="255" />
                      </svg>
                      <svg className="sustain_child-right__line pc_only">
                        <circle className={`move-line ${animatedMoveLines[0] ? "animate" : ""}`} cx="256" cy="256" r="255" />
                      </svg>
                      <svg className="sustain_child-right__circle sp_only">
                        <circle cx="138" cy="138" r="137" />
                      </svg>
                      <svg className="sustain_child-right__line sp_only">
                        <circle className={`move-line ${animatedMoveLines[0] ? "animate" : ""}`} cx="138" cy="138" r="137" />
                      </svg>
                    </div>
                  </div>
                  <div className="sustain_child sustain_child2">
                    <div className="sustain_child-right">
                      <Image
                        src="/asset/img/sustain_child-right__img2.png"
                        alt="画像"
                      />
                      <svg className="sustain_child-right__circle pc_only">
                        <circle cx="256" cy="256" r="255" />
                      </svg>
                      <svg className="sustain_child-right__line pc_only">
                        <circle className={`move-line ${animatedMoveLines[1] ? "animate" : ""}`} cx="256" cy="256" r="255" />
                      </svg>
                      <svg className="sustain_child-right__circle sp_only">
                        <circle cx="138" cy="138" r="137" />
                      </svg>
                      <svg className="sustain_child-right__line sp_only">
                        <circle className={`move-line ${animatedMoveLines[1] ? "animate" : ""}`} cx="138" cy="138" r="137" />
                      </svg>
                    </div>
                  </div>
                  <div className="sustain_child sustain_child3">
                    <div className="sustain_child-right">
                      <Image
                        src="/asset/img/sustain_child-right__img3.png"
                        alt="画像"
                      />
                      <svg className="sustain_child-right__circle pc_only">
                        <circle cx="256" cy="256" r="255" />
                      </svg>
                      <svg className="sustain_child-right__line pc_only">
                        <circle className={`move-line ${animatedMoveLines[2] ? "animate" : ""}`} cx="256" cy="256" r="255" />
                      </svg>
                      <svg className="sustain_child-right__circle sp_only">
                        <circle cx="138" cy="138" r="137" />
                      </svg>
                      <svg className="sustain_child-right__line sp_only">
                        <circle className={`move-line ${animatedMoveLines[2] ? "animate" : ""}`} cx="138" cy="138" r="137" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* <!-- section works --> */}
          <section id="works" className="works">
            <div className="outer_container">
              <div className="inner_container">
                <Link
                  className="works_link viewmore"
                  href="https://www.youtube.com/@stackedstate6016"
                  target="_blank"
                >
                  <span className="works_link-span viewmore-span">
                    <Image
                      src="/asset/img/header_mega-menu__item-right__child-bottomO.svg"
                      alt="リンクボタン"
                    />
                  </span>
                  <p className="hologen">VIEW MORE</p>
                </Link>
                <p className="jp">
                  {/* 動画 */}
                  {formatContent(t('video'))}
                </p>
                <h2 className="eng hologen">YOUTUBE</h2>
                <div className="works_articles">
                  <div className="swiper">
                    <ul className="works_articles-slider swiper-wrapper">
                      <Slider ref={sliderRef} {...sliderSettings2}>
                        <li className="works_articles-slider__item swiper-slide">
                          <iframe
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/t3j9WmxXCEQ?si=E57zROcFhYYI9P4H"
                            title="YouTube video player"
                            style={{ border: 'none' }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          ></iframe>
                        </li>
                        <li className="works_articles-slider__item swiper-slide">
                          <iframe
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/VlXWOYWRpXM?si=a4nG0LUQujJ-xKlu"
                            title="YouTube video player"
                            style={{ border: 'none' }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          ></iframe>
                        </li>
                        <li className="works_articles-slider__item swiper-slide">
                          <iframe
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/HE4Tqu6AiPA?si=-TMFrsu57fOOTyAe"
                            title="YouTube video player"
                            style={{ border: 'none' }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          ></iframe>
                        </li>
                        <li className="works_articles-slider__item swiper-slide">
                          <iframe
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/ksZtTr2wy_8?si=PODLvgkYYhFMPZ9A"
                            title="YouTube video player"
                            style={{ border: 'none' }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          ></iframe>
                        </li>
                      </Slider>
                    </ul>
                    <span
                      className="acmin works-slider-next"
                      onClick={handleNextClick}
                      style={{ cursor: "pointer" }}
                    >
                      &gt;&gt;
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      {/* <!-- footer --> */}
      <footer>
        <div className="outer_container">
          <div className="footer_wrapper">
            <div className="footer_contents">
              <div className="footer_contents-item1 footer_contents-item">
                <Image src="/asset/img/header_logo.png" alt="ロゴ画像" />
              </div>
            </div>
            <ul className="footer_icons">
              <li className="footer_icons__instagram">
                <Link href="https://x.com/stackedstate" target="_blank">
                  <Image src="/asset/img/x.png" alt="x" />
                </Link>
              </li>
              <li className="footer_icons__facebook">
                <Link
                  href="https://www.facebook.com/profile.php?id=100064457993166&locale=ja_JP"
                  target="_blank"
                >
                  <Image src="/asset/img/facebook.png" alt="facebook" />
                </Link>
              </li>
              <li className="footer_icons__youtube">
                <Link href="https://www.youtube.com/@stackedstate6016#" target="_blank">
                  <Image src="/asset/img/youtube.png" alt="Youtube" />
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer_copyright">
            <p>©Stacked State All right reserved.</p>
          </div>
        </div>
      </footer>
      {/* <script src="/asset/js/main.js"></script> */}
    </>
  );
}

// const container = document.getElementById("__next");

// if (container) {
//   hydrateRoot(container, <HomePage />, {
//     onRecoverableError: (error) => {
//       console.error("Recoverable Hydration Error:", error);
//     },
//   });
// }
