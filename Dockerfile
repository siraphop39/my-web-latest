FROM php:8.3-cli-alpine

WORKDIR /app

# ติดตั้ง System Dependencies สำหรับ PHP และ Node.js
RUN apk add --no-cache \
    nodejs \
    npm \
    git \
    unzip \
    sqlite \
    sqlite-dev

# ติดตั้ง PHP Extensions สำหรับ Laravel และ SQLite
RUN docker-php-ext-install pdo pdo_sqlite bcmath

# ติดตั้ง Composer จาก Official Image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# คัดลอกซอร์สโค้ดทั้งหมด
COPY . .

# ติดตั้ง Dependencies และ Build Frontend Assets
RUN composer install --no-dev --optimize-autoloader \
    && npm install \
    && npm run build

# กำหนดสิทธิ์โฟลเดอร์สำหรับเขียนไฟล์ Database และ Cache
RUN chmod -R 777 storage bootstrap/cache database

# เปิดพอร์ตสำหรับ Render (Render จะกำหนดค่า $PORT อัตโนมัติ)
EXPOSE 8000

# รัน Migrate, Seed ข้อมูล และเปิดเซิร์ฟเวอร์
CMD ["sh", "-c", "touch database/database.sqlite && chmod 777 database/database.sqlite && php artisan migrate:fresh --seed --force && php artisan serve --host 0.0.0.0 --port ${PORT:-8000}"]
