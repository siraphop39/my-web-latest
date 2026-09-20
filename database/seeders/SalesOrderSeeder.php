<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SalesOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create or update Default Admin User
        $user = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'รัชชานนท์ ช่วยบุญ, สิระภพ นาคคำ',
                'password' => Hash::make('password'),
            ]
        );

        // 2. Create Sample Customers
        $customers = [
            [
                'name' => 'สมชาย รักดี',
                'email' => 'somchai@gmail.com',
                'phone' => '081-234-5678',
                'address' => '123/45 ถนนพหลโยธิน แขวงสามเสนใน เขตพญาไท กทม. 10400',
            ],
            [
                'name' => 'วิภาดา รุ่งเรือง',
                'email' => 'wiphada@hotmail.com',
                'phone' => '089-876-5432',
                'address' => '88/9 หมู่ 2 ตำบลบางกรวย อำเภอบางกรวย จ.นนทบุรี 11130',
            ],
            [
                'name' => 'กิตติศักดิ์ เจริญทรัพย์',
                'email' => 'kittisak.c@company.co.th',
                'phone' => '082-345-6789',
                'address' => '555 อาคารไซเบอร์เวิลด์ ชั้น 12 ถนนรัชดาภิเษก ห้วยขวาง กทม. 10310',
            ],
            [
                'name' => 'นภัสสร แก้วมณี',
                'email' => 'napatsorn.k@yahoo.com',
                'phone' => '086-112-2334',
                'address' => '74/1 ถนนสุขุมวิท 71 แขวงพระโขนงเหนือ เขตวัฒนา กทม. 10110',
            ],
        ];

        $customerModels = [];
        foreach ($customers as $cData) {
            $customerModels[] = Customer::updateOrCreate(['email' => $cData['email']], $cData);
        }

        // 3. Create Sample Products
        $products = [
            [
                'name' => 'เมาส์ไร้สายบลูทูธ Ergonomic Pro',
                'sku' => 'PROD-001',
                'description' => 'เมาส์ออกแบบตามหลักสรีรศาสตร์ เชื่อมต่อไร้สาย 2.4GHz และ Bluetooth แบตอึด 60 วัน',
                'price' => 890.00,
                'stock' => 45,
            ],
            [
                'name' => 'คีย์บอร์ดแมคคานิคอล RGB Mechanical Keyboard',
                'sku' => 'PROD-002',
                'description' => 'สวิตช์ Red switch เสียงเงียบ ไฟ RGB 16.8 ล้านสี รองรับ Windows/Mac',
                'price' => 1990.00,
                'stock' => 28,
            ],
            [
                'name' => 'แผ่นรองเมาส์ขนาดใหญ่ Speed Gaming Mat XXL',
                'sku' => 'PROD-003',
                'description' => 'ขนาด 90x40 ซม. ผิวเรียบลื่น กันน้ำ เย็บขอบอย่างดี',
                'price' => 350.00,
                'stock' => 80,
            ],
            [
                'name' => 'หูฟังตัดเสียงรบกวน Wireless ANC Headphone',
                'sku' => 'PROD-004',
                'description' => 'ระบบตัดเสียงรบกวน Active Noise Cancelling ไมค์คมชัด เหมาะสำหรับเรียนและทำงาน',
                'price' => 2490.00,
                'stock' => 15,
            ],
            [
                'name' => 'ขาตั้งแล็ปท็อปอลูมิเนียม พับได้ ปรับระดับได้',
                'sku' => 'PROD-005',
                'description' => 'ผลิตจากอลูมิเนียมเกรดพรีเมียม ระบายความร้อนได้ดี รองรับขนาด 11-17 นิ้ว',
                'price' => 490.00,
                'stock' => 60,
            ],
            [
                'name' => 'USB-C Multifunction Hub 7-in-1',
                'sku' => 'PROD-006',
                'description' => 'HDMI 4K, USB 3.0 x3, SD/TF Card Reader, PD 100W Fast Charge',
                'price' => 1290.00,
                'stock' => 32,
            ],
        ];

        $productModels = [];
        foreach ($products as $pData) {
            $productModels[] = Product::updateOrCreate(['sku' => $pData['sku']], $pData);
        }

        // 4. Create Sample Orders with Different Statuses
        $sampleOrders = [
            [
                'order_number' => 'ORD-202609-001',
                'customer_idx' => 0, // สมชาย
                'status' => 'Pending',
                'notes' => 'ลูกค้าขอกล่องพัสดุห่อกันกระแทกเป็นพิเศษ',
                'order_date' => now()->format('Y-m-d'),
                'items' => [
                    ['product_idx' => 0, 'qty' => 1], // เมาส์
                    ['product_idx' => 2, 'qty' => 2], // แผ่นรองเมาส์ 2 ผืน
                ]
            ],
            [
                'order_number' => 'ORD-202609-002',
                'customer_idx' => 1, // วิภาดา
                'status' => 'Shipped',
                'notes' => 'ส่งผ่าน Flash Express เลขพัสดุ TH123456789',
                'order_date' => now()->subDay()->format('Y-m-d'),
                'items' => [
                    ['product_idx' => 1, 'qty' => 1], // คีย์บอร์ด
                    ['product_idx' => 4, 'qty' => 1], // ขาตั้ง
                ]
            ],
            [
                'order_number' => 'ORD-202609-003',
                'customer_idx' => 2, // กิตติศักดิ์
                'status' => 'Delivered',
                'notes' => 'จัดส่งถึงเคาน์เตอร์ตึกแล้ว ลูกค้ารับของเรียบร้อย',
                'order_date' => now()->subDays(3)->format('Y-m-d'),
                'items' => [
                    ['product_idx' => 3, 'qty' => 1], // หูฟัง
                    ['product_idx' => 5, 'qty' => 2], // Hub 2 ชิ้น
                ]
            ],
            [
                'order_number' => 'ORD-202609-004',
                'customer_idx' => 3, // นภัสสร
                'status' => 'Pending',
                'notes' => 'รอโอนเงินยืนยันก่อนบ่ายสอง',
                'order_date' => now()->format('Y-m-d'),
                'items' => [
                    ['product_idx' => 4, 'qty' => 2], // ขาตั้ง 2
                ]
            ],
        ];

        foreach ($sampleOrders as $ord) {
            $customer = $customerModels[$ord['customer_idx']];
            $order = Order::updateOrCreate(
                ['order_number' => $ord['order_number']],
                [
                    'customer_id' => $customer->id,
                    'user_id' => $user->id,
                    'status' => $ord['status'],
                    'notes' => $ord['notes'],
                    'order_date' => $ord['order_date'],
                    'total_amount' => 0,
                ]
            );

            // Clean previous items if any
            $order->items()->delete();

            $total = 0;
            foreach ($ord['items'] as $item) {
                $prod = $productModels[$item['product_idx']];
                $subtotal = $prod->price * $item['qty'];
                $total += $subtotal;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $prod->id,
                    'quantity' => $item['qty'],
                    'unit_price' => $prod->price,
                    'subtotal' => $subtotal,
                ]);
            }

            $order->update(['total_amount' => $total]);
        }
    }
}
