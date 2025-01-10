import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
};
module.exports = {
  images: {
    unoptimized: true, // 画像最適化を無効化
  },
  i18n: {
    locales: ['ja', 'en'], // 対応する言語を指定（日本語と英語）
    defaultLocale: 'ja',   // デフォルトの言語
  },
};

export default nextConfig;
