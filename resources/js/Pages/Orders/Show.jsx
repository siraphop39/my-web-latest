import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ order }) {
    const handleStatusChange = (newStatus) => {
        router.patch(route('orders.update-status', order.id), { status: newStatus }, {
            preserveScroll: true,
        });
    };

    const handleDelete = () => {
        if (confirm(`คุณต้องการลบใบสั่งซื้อ ${order.order_number} หรือไม่?`)) {
            router.delete(route('orders.destroy', order.id));
        }
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val);
    };

    // Stepper logic
    const steps = [
        { key: 'Pending', label: 'รอดำเนินการ', desc: 'รับออเดอร์แล้ว' },
        { key: 'Shipped', label: 'จัดส่งแล้ว', desc: 'พัสดุกำลังจัดส่ง' },
        { key: 'Delivered', label: 'ส่งมอบสำเร็จ', desc: 'ลูกค้าได้รับของแล้ว' },
    ];

    const getStepIndex = (status) => {
        if (status === 'Pending') return 0;
        if (status === 'Shipped') return 1;
        if (status === 'Delivered') return 2;
        return -1;
    };

    const currentStepIndex = getStepIndex(order.status);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-gray-800 leading-tight font-mono">
                                {order.order_number}
                            </h2>
                            <span className="text-xs text-gray-500">
                                วันที่: {order.order_date || new Date(order.created_at).toLocaleDateString('th-TH')}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            บันทึกโดย: {order.user?.name || 'ระบบส่วนกลาง'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('orders.receipt', order.id)}
                            target="_blank"
                            className="inline-flex items-center px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg shadow-sm transition gap-1.5"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            พิมพ์ / ดาวน์โหลดใบเสร็จ PDF
                        </Link>
                        <Link
                            href={route('orders.edit', order.id)}
                            className="px-3.5 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-lg transition"
                        >
                            แก้ไข
                        </Link>
                        <Link
                            href={route('orders.index')}
                            className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition"
                        >
                            ← กลับ
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`ใบสั่งซื้อ ${order.order_number}`} />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Status Stepper Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-2">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">ติดตามสถานะออเดอร์ (Status Tracking)</h3>
                            <p className="text-xs text-gray-500">คลิกปุ่มเพื่อเปลี่ยนสถานะคำสั่งซื้อแบบทันที</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            {steps.map((step) => (
                                <button
                                    key={step.key}
                                    onClick={() => handleStatusChange(step.key)}
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg border transition ${
                                        order.status === step.key
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                    }`}
                                >
                                    {step.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Visual Stepper */}
                    <div className="pt-6">
                        <div className="grid grid-cols-3 gap-4 text-center relative">
                            {steps.map((step, idx) => {
                                const isPassed = currentStepIndex >= idx;
                                const isCurrent = currentStepIndex === idx;
                                return (
                                    <div key={step.key} className="flex flex-col items-center">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                                                isCurrent
                                                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                                                    : isPassed
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-gray-100 text-gray-400'
                                            }`}
                                        >
                                            {isPassed && !isCurrent ? '✓' : idx + 1}
                                        </div>
                                        <div className="mt-2 text-xs font-semibold text-gray-900">{step.label}</div>
                                        <div className="text-[11px] text-gray-400">{step.desc}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Items Table (2 cols) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-sm font-bold text-gray-900">รายการสินค้าในใบสั่งซื้อ</h3>
                                <span className="text-xs text-gray-500">{order.items?.length || 0} รายการ</span>
                            </div>

                            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-5 py-3">สินค้า</th>
                                        <th className="px-5 py-3 text-center">จำนวน</th>
                                        <th className="px-5 py-3 text-right">ราคาต่อหน่วย</th>
                                        <th className="px-5 py-3 text-right">ยอดรวม</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {order.items?.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-5 py-3.5">
                                                <div className="font-medium text-gray-900">{item.product?.name}</div>
                                                <div className="text-xs text-gray-400 font-mono">SKU: {item.product?.sku || '-'}</div>
                                            </td>
                                            <td className="px-5 py-3.5 text-center text-gray-700 font-semibold">
                                                {item.quantity}
                                            </td>
                                            <td className="px-5 py-3.5 text-right text-gray-600 font-mono">
                                                {formatCurrency(item.unit_price)}
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-semibold text-gray-900 font-mono">
                                                {formatCurrency(item.subtotal)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Totals Breakdown */}
                            <div className="p-5 bg-gray-50 border-t border-gray-100 flex justify-end">
                                <div className="w-full sm:w-64 space-y-2">
                                    <div className="flex justify-between text-xs text-gray-600">
                                        <span>ยอดรวมสินค้า:</span>
                                        <span className="font-mono">{formatCurrency(order.total_amount)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-600">
                                        <span>ภาษีมูลค่าเพิ่ม (VAT 7% รวมแล้ว):</span>
                                        <span className="font-mono">{formatCurrency(order.total_amount * 0.07 / 1.07)}</span>
                                    </div>
                                    <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                                        <span>ยอดรวมสุทธิ:</span>
                                        <span className="text-indigo-600 font-mono">{formatCurrency(order.total_amount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes Card */}
                        {order.notes && (
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">หมายเหตุ</h4>
                                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{order.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Customer Info & Actions (1 col) */}
                    <div className="space-y-6">
                        {/* Customer Card */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 border-b pb-2">ข้อมูลลูกค้า</h3>
                            <div className="space-y-2.5 text-xs text-gray-600">
                                <div>
                                    <span className="text-gray-400 block">ชื่อลูกค้า:</span>
                                    <span className="text-sm font-semibold text-gray-900">{order.customer?.name}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block">เบอร์โทรศัพท์:</span>
                                    <span className="text-gray-800">{order.customer?.phone || '-'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block">อีเมล:</span>
                                    <span className="text-gray-800">{order.customer?.email || '-'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block">ที่อยู่จัดส่ง:</span>
                                    <span className="text-gray-800 leading-relaxed">{order.customer?.address || '-'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Management Actions */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-3">
                            <h3 className="text-sm font-bold text-gray-900 border-b pb-2">จัดการ</h3>
                            <Link
                                href={route('orders.receipt', order.id)}
                                target="_blank"
                                className="w-full flex items-center justify-center py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg shadow-sm transition gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                ดู / พิมพ์ใบเสร็จรับเงิน PDF
                            </Link>
                            <Link
                                href={route('orders.edit', order.id)}
                                className="w-full flex items-center justify-center py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition"
                            >
                                แก้ไขรายละเอียดใบสั่งซื้อ
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="w-full py-2 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg transition border border-rose-200"
                            >
                                ลบใบสั่งซื้อนี้
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
