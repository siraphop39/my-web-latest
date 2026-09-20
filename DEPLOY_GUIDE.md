# คู่มือการรันและการ Deploy: ระบบจัดการการขายและใบสั่งซื้อ
**Sales & Order Management System**  
**ผู้จัดทำ:** รัชชานนท์ ช่วยบุญ, สิระภพ นาคคำ

---

## 🔑 บัญชีทดสอบสำหรับตรวจงาน (Default Login)

ระบบมี Seeder เตรียมข้อมูลตัวอย่างพร้อมเข้าตรวจได้ทันที:
- **อีเมล (Email):** `admin@example.com`
- **รหัสผ่าน (Password):** `password`

---

## 💻 วิธีที่ 1: การรันในเครื่อง (Local Development)

### 1. ติดตั้ง Dependencies
```bash
composer install
npm install
```

### 2. ตั้งค่าไฟล์ Environment และ Database
```bash
# คัดลอก .env
cp .env.example .env

# สร้างคีย์ของ Laravel
php artisan key:generate

# สร้างตารางและใส่ข้อมูลตัวอย่างทั้งหมดลง SQLite
php artisan migrate:fresh --seed
```

### 3. เริ่มรันเซิร์ฟเวอร์
เปิด 2 หน้าต่าง Terminal:
- **Terminal 1:** `php artisan serve`
- **Terminal 2:** `npm run dev`

เข้าใช้งานผ่านเบราว์เซอร์: `http://localhost:8000`

---

## 🌐 วิธีที่ 2: การ Deploy ขึ้น Render.com (เว็บออนไลน์ฟรี 24 ชม.)

Render.com มี Free Tier รองรับทั้ง PHP และ Node.js:

1. นำโค้ดขึ้น **GitHub Repository** ของคุณ
2. เข้าสู่ระบบ [Render.com](https://dashboard.render.com/)
3. คลิก **New +** → เลือก **Blueprint** หรือ **Web Service**
   - **กรณีเลือก Blueprint:** เลือก Repository ของคุณ ระบบจะอ่านค่าจากไฟล์ `render.yaml` อัตโนมัติ แล้วกด **Apply** ได้ทันที
   - **กรณีเลือก Web Service:**
     - **Runtime:** `PHP`
     - **Build Command:**
       ```bash
       composer install --no-dev --optimize-autoloader && npm install && npm run build
       ```
     - **Start Command:**
       ```bash
       touch database/database.sqlite && php artisan migrate:fresh --seed --force && php artisan serve --host 0.0.0.0 --port $PORT
       ```
     - **Environment Variables:**
       - `APP_ENV` = `production`
       - `APP_DEBUG` = `true` (เพื่อให้เห็นข้อผิดพลาดหากมีปัญหา)
       - `DB_CONNECTION` = `sqlite`
       - `APP_KEY` = (คลิก Generate หรือรัน `php artisan key:generate --show` แล้วนำมาวาง)
4. รอระบบ Build ประมาณ 2-3 นาที จะได้ URL เช่น `https://sales-order-system.onrender.com` นำไปส่งให้อาจารย์ตรวจได้ทันที

---

## ⚡ วิธีที่ 3: เปิดให้ตรวจผ่านเน็ตทันทีด้วย Cloudflare Tunnel (ไม่ต้อง Deploy)

หากเซิร์ฟเวอร์ฟรีใช้เวลา Deploy นาน หรือต้องการเปิดให้ตรวจสดจากเครื่องเราโดยตรง:

1. ดาวน์โหลด [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/)
2. รันคำสั่งเจาะพอร์ต:
   ```bash
   cloudflared tunnel --url http://localhost:8000
   ```
3. จะได้รับลิงก์ `https://xxxx.trycloudflare.com` ส่งให้อาจารย์กดเข้าตรวจได้ทันทีโดยที่ข้อมูลไม่หายแน่นอน 100%

---

## 📦 ฟังก์ชันที่พัฒนาแล้วในระบบ
- ✅ **Laravel 12 + React + Inertia + Tailwind CSS**
- ✅ **ระบบยืนยันตัวตน (Authentication):** Laravel Breeze
- ✅ **จัดการใบสั่งซื้อ (Order CRUD):** เพิ่ม, ลบ, แก้ไข, ดูรายละเอียด
- ✅ **ติดตามสถานะออเดอร์ (Status Tracking):** `Pending` ➔ `Shipped` ➔ `Delivered`
- ✅ **ออกใบเสร็จรับเงิน PDF:** แสดงรายการสินค้า, ภาษี, ยอดรวม และกดพิมพ์/เซฟ PDF ได้ในคลิกเดียว
- ✅ **REST API Endpoints:** บันทึกและดึงข้อมูลออเดอร์ผ่าน `/api/orders`
