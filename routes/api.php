<?php

use App\Http\Controllers\Api\OrderApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Sales & Order Management System API
Route::prefix('orders')->group(function () {
    Route::get('/', [OrderApiController::class, 'index'])->name('api.orders.index');
    Route::post('/', [OrderApiController::class, 'store'])->name('api.orders.store');
    Route::get('/{order}', [OrderApiController::class, 'show'])->name('api.orders.show');
    Route::delete('/{order}', [OrderApiController::class, 'destroy'])->name('api.orders.destroy');
    Route::patch('/{order}/status', [OrderApiController::class, 'updateStatus'])->name('api.orders.update-status');
});

Route::get('/products', [OrderApiController::class, 'getProducts'])->name('api.products.index');
Route::get('/customers', [OrderApiController::class, 'getCustomers'])->name('api.customers.index');
Route::post('/customers', [OrderApiController::class, 'storeCustomer'])->name('api.customers.store');
