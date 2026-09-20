<?php

use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// หน้าแรกสุด: หากล็อกอินแล้วไปหน้า Orders หากยังไม่ล็อกอินไปหน้า Login
Route::get('/', function () {
    return auth()->check() ? redirect()->route('orders.index') : redirect()->route('login');
});

// Dashboard redirect to Orders
Route::get('/dashboard', function () {
    return redirect()->route('orders.index');
})->middleware(['auth'])->name('dashboard');

// Protected Routes สำหรับระบบจัดการการขายและใบสั่งซื้อ
Route::middleware(['auth'])->group(function () {
    // Orders CRUD
    Route::resource('orders', OrderController::class);
    
    // Quick Status Update (Pending -> Shipped -> Delivered)
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.update-status');
    
    // พิมพ์ / บันทึกใบเสร็จรับเงิน PDF
    Route::get('/orders/{order}/receipt', [OrderController::class, 'receipt'])->name('orders.receipt');

    // Profile Management (Laravel Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// หน้าสินค้าเดิม (เพื่อ Backward Compatibility)
Route::get('/product', function () {
    $products = Product::all();
    return Inertia::render('ProductList', compact('products'));
})->name('product');

// โหลด Breeze Authentication Routes (login, register, logout, etc.)
require __DIR__.'/auth.php';
