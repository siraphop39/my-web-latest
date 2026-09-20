import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ customers, products, defaultOrderNumber }) {
    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors } = useForm({
        customer_id: customers.length > 0 ? customers[0].id : '',
        order_date: today,
        status: 'Pending',
        notes: '',
        items: [
            {
                product_id: products.length > 0 ? products[0].id : '',
                quantity: 1,
                unit_price: products.length > 0 ? products[0].price : 0,
            },
        ],
    });

    const handleProductChange = (index, productId) => {
        const selectedProd = products.find((p) => p.id === parseInt(productId));
        const newItems = [...data.items];
        newItems[index] = {
            ...newItems[index],
            product_id: productId,
            unit_price: selectedProd ? selectedProd.price : 0,
        };
        setData('items', newItems);
    };

    const handleQuantityChange = (index, qty) => {
        const quantity = Math.max(1, parseInt(qty) || 1);
        const newItems = [...data.items];
        newItems[index].quantity = quantity;
        setData('items', newItems);
    };

    const handleUnitPriceChange = (index, price) => {
        const unit_price = Math.max(0, parseFloat(price) || 0);
        const newItems = [...data.items];
        newItems[index].unit_price = unit_price;
        setData('items', newItems);
    };

    const addItemRow = () => {
        const defaultProd = products[0] || { id: '', price: 0 };
        setData('items', [
            ...data.items,
            {
                product_id: defaultProd.id,
                quantity: 1,
                unit_price: defaultProd.price,
            },
        ]);
    };

    const removeItemRow = (index) => {
        if (data.items.length <= 1) {
            alert('ต้องมีรายการสินค้าอย่างน้อย 1 รายการ');
            return;
        }
        setData(
            'items',
            data.items.filter((_, i) => i !== index)
        );
    };

    const calculateGrandTotal = () => {
        return data.items.reduce((sum, item) => {
            return sum + (item.quantity * item.unit_price || 0);
        }, 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('orders.store'));
    };

    const selectedCustomer = customers.find((c) => c.id === parseInt(data.customer_id));

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 leading-tight">
                            สร้างใบสั่งซื้อใหม่ (Create Order)
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            เลขที่ใบสั่งซื้ออัตโนมัติ: <span className="font-mono font-semibold text-indigo-600">{defaultOrderNumber}</span>
                        </p>
                    </div>
                    <Link
                        href={route('orders.index')}
                        className="text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-2 rounded-lg"
                    >
                        ← กลับหน้ารายการ
                    </Link>
                </div>
            }
        >
            <Head title="สร้างใบสั่งซื้อใหม่" />

            <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* General Information Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-base font-semibold text-gray-900 border-b pb-2">
                            ข้อมูลทั่วไปและลูกค้า
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Customer Select */}
                            <div className="md:col-span-1">
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    เลือกลูกค้า <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={data.customer_id}
                                    onChange={(e) => setData('customer_id', e.target.value)}
                                    className="w-full text-sm rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {customers.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name} ({c.phone || c.email})
                                        </option>
                                    ))}
                                </select>
                                {errors.customer_id && (
                                    <p className="text-xs text-rose-600 mt-1">{errors.customer_id}</p>
                                )}

                                {selectedCustomer && (
                                    <div className="mt-2 p-2.5 bg-gray-50 rounded-lg text-xs text-gray-600 space-y-1 border border-gray-100">
                                        <p><strong>เบอร์โทร:</strong> {selectedCustomer.phone || '-'}</p>
                                        <p><strong>ที่อยู่:</strong> {selectedCustomer.address || '-'}</p>
                                    </div>
                                )}
                            </div>

                            {/* Order Date */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    วันที่สั่งซื้อ <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.order_date}
                                    onChange={(e) => setData('order_date', e.target.value)}
                                    className="w-full text-sm rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.order_date && (
                                    <p className="text-xs text-rose-600 mt-1">{errors.order_date}</p>
                                )}
                            </div>

                            {/* Order Status */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    สถานะคำสั่งซื้อ <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full text-sm rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="Pending">รอดำเนินการ (Pending)</option>
                                    <option value="Shipped">จัดส่งแล้ว (Shipped)</option>
                                    <option value="Delivered">ส่งมอบสำเร็จ (Delivered)</option>
                                    <option value="Cancelled">ยกเลิก (Cancelled)</option>
                                </select>
                                {errors.status && (
                                    <p className="text-xs text-rose-600 mt-1">{errors.status}</p>
                                )}
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                หมายเหตุคำสั่งซื้อ (Notes)
                            </label>
                            <input
                                type="text"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="เช่น ที่อยู่จัดส่งเพิ่มเติม, เลขพัสดุ, หรือหมายเหตุสำหรับลูกค้า"
                                className="w-full text-sm rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Order Items Table Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">
                                    รายการสินค้าที่สั่งซื้อ (Order Items)
                                </h3>
                                <p className="text-xs text-gray-500">เลือกสินค้าและจำนวน ระบบจะคำนวณยอดเงินรวมอัตโนมัติ</p>
                            </div>
                            <button
                                type="button"
                                onClick={addItemRow}
                                className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold rounded-lg transition"
                            >
                                + เพิ่มแถวสินค้า
                            </button>
                        </div>

                        {errors.items && (
                            <p className="text-xs text-rose-600">{errors.items}</p>
                        )}

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                                <thead className="bg-gray-50 text-xs font-semibold text-gray-500">
                                    <tr>
                                        <th className="px-4 py-2.5">ลำดับ</th>
                                        <th className="px-4 py-2.5">สินค้า</th>
                                        <th className="px-4 py-2.5 w-32">ราคาต่อหน่วย (฿)</th>
                                        <th className="px-4 py-2.5 w-28">จำนวน</th>
                                        <th className="px-4 py-2.5 w-36 text-right">ยอดรวม (฿)</th>
                                        <th className="px-4 py-2.5 w-16 text-center">ลบ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data.items.map((item, index) => {
                                        const subtotal = (item.quantity || 0) * (item.unit_price || 0);
                                        return (
                                            <tr key={index}>
                                                <td className="px-4 py-3 text-gray-400 text-xs font-mono">{index + 1}</td>
                                                <td className="px-4 py-3">
                                                    <select
                                                        value={item.product_id}
                                                        onChange={(e) => handleProductChange(index, e.target.value)}
                                                        className="w-full text-xs rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                                    >
                                                        {products.map((p) => (
                                                            <option key={p.id} value={p.id}>
                                                                {p.name} (สต็อก: {p.stock})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={item.unit_price}
                                                        onChange={(e) => handleUnitPriceChange(index, e.target.value)}
                                                        className="w-full text-xs rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                        className="w-full text-xs rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-center"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-right font-semibold text-gray-900 font-mono">
                                                    {formatCurrency(subtotal)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItemRow(index)}
                                                        className="text-gray-400 hover:text-rose-600 transition"
                                                        title="ลบรายการนี้"
                                                    >
                                                        ✕
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary Box */}
                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <div className="w-full sm:w-72 bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-100">
                                <div className="flex justify-between text-xs text-gray-600">
                                    <span>จำนวนรายการสินค้า:</span>
                                    <span className="font-semibold">{data.items.length} รายการ</span>
                                </div>
                                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                                    <span>ยอดรวมสุทธิ:</span>
                                    <span className="text-indigo-600 font-mono">{formatCurrency(calculateGrandTotal())}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Link
                            href={route('orders.index')}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                        >
                            ยกเลิก
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                        >
                            {processing ? 'กำลังบันทึก...' : 'บันทึกใบสั่งซื้อ'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
