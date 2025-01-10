import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// 各ロケールの翻訳ファイルをインポート
import enCommon from "./public/locales/en/common.json";
import jaCommon from "./public/locales/ja/common.json";

// resources オブジェクトを作成
const resources = {
  en: {
    common: enCommon,
  },
  ja: {
    common: jaCommon,
  },
};

i18n.use(initReactI18next).init({
  resources,
  ns: ["common"], // 名前空間を設定
  defaultNS: "common", // デフォルトの名前空間
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
