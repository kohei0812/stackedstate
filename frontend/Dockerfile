# Node.jsイメージの指定
FROM node:18

# 作業ディレクトリ
WORKDIR /app

# パッケージをインストール
COPY package.json yarn.lock ./
RUN yarn install

# アプリケーションコードをコピー
COPY . .

# ポートを開放
EXPOSE 3000

# 開発サーバを起動
CMD ["yarn", "dev"]
