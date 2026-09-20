# ⚡ คู่มือติดตั้งโปรเจกต์ (Local Setup - ฉบับย่อ)

### 1. โปรแกรมที่ต้องมีในเครื่อง
* **PHP >= 8.2** (เช่น ผ่าน Laragon หรือ XAMPP)
* **Composer**
* **Node.js >= 18** & npm
* **Git**

---

### 2. ขั้นตอนติดตั้งและรันโปรเจกต์

เปิด Terminal ที่โฟลเดอร์โปรเจกต์ แล้วรันคำสั่งตามลำดับ:

#### 1) ติดตั้ง Dependencies
```bash
composer install
npm install
```

#### 2) ตั้งค่า .env และสร้าง Application Key
```bash
# สำหรับ Windows (PowerShell / CMD)
copy .env.example .env

# สร้าง APP_KEY
php artisan key:generate
```

#### 3) สร้างฐานข้อมูล (SQLite) และ Migrate ข้อมูล
```bash
# สร้างไฟล์ database.sqlite
php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');"

# สร้างตารางและใส่ข้อมูลตัวอย่าง
php artisan migrate --seed
```

#### 4) รันโปรเจกต์ (เปิด 2 Terminal)
* **Terminal 1 (Backend):**
  ```bash
  php artisan serve
  ```
* **Terminal 2 (Frontend):**
  ```bash
  npm run dev
  ```

---

### 3. เข้าใช้งาน
เปิด Browser ไปที่: **[http://localhost:8000](http://localhost:8000)**

---

### 4. คำสั่งแก้ปัญหาที่พบบ่อย
* **หน้าเว็บฟ้องไม่มี Key:** `php artisan key:generate`
* **รีเซ็ตฐานข้อมูลใหม่หมด:** `php artisan migrate:fresh --seed`
* **ล้างแคชระบบ:** `php artisan optimize:clear`
