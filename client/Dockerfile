FROM php:8.2-apache

RUN pecl install redis
RUN docker-php-ext-enable redis

COPY . /var/www/html 