# PHPイメージの指定
FROM php:8.1-fpm

# 必要なライブラリをインストール
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev zip unzip git \
    nginx \
    && docker-php-ext-install pdo pdo_mysql gd

# Composerのインストール
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

# 作業ディレクトリ
WORKDIR /var/www

# 権限の設定
RUN usermod -u 1000 www-data

# Nginxの設定ファイルをコピー
COPY nginx/conf.d/default.conf /etc/nginx/sites-available/default

# NginxとPHP-FPMの両方を起動するためのエントリーポイント
CMD service nginx start && php-fpm
