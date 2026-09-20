import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Receipt({ order }) {
    const handlePrint = () => {
        window.print();
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val);
    };

    const subtotal = order.total_amount || 0;
    const vat = subtotal * 0.07 / 1.07;
    const netBeforeVat = subtotal - vat;

    return (
        <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
            <Head title={`ใบเสร็จรับเงิน ${order.order_number}`} />

            {/* Print Action Bar (Hidden when printing) */}
            <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
                <Link
                    href={route('orders.show', order.id)}
                    className="inline-flex items-center text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-300 px-3.5 py-2 rounded-lg shadow-sm transition"
                >
                    ← กลับหน้ารายละเอียดออเดอร์
                </Link>
                <button
                    onClick={handlePrint}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    พิมพ์ / บันทึกเป็น PDF (Print)
                </button>
            </div>

            {/* Receipt Container */}
            <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-sm border border-gray-200 print:border-0 print:shadow-none print:p-4">
                {/* Header */}
                <div className="border-b-2 border-gray-900 pb-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                            <span className="inline-block px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[11px] font-bold tracking-wide uppercase mb-1">
                                โครงงานวิชาการ (Student Project)
                            </span>
                            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                                ระบบจัดการการขายและใบสั่งซื้อ
                            </h1>
                            <p className="text-xs text-gray-500 mt-1">
                                ผู้จัดทำ: <strong>รัชชานนท์ ช่วยบุญ, สิระภพ นาคคำ</strong>
                            </p>
                        </div>
                        <div className="sm:text-right">
                            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                                ใบเสร็จรับเงิน / ใบกำกับภาษี
                            </h2>
                            <p className="text-xs text-gray-500 font-mono font-bold mt-1">
                                RECEIPT / TAX INVOICE
                            </p>
                            <p className="text-xs font-mono font-bold text-indigo-600 mt-1">
                                {order.order_number}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                วันที่: {order.order_date || new Date(order.created_at).toLocaleDateString('th-TH')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Customer & Order Metadata */}
                <div className="grid grid-cols-2 gap-6 mb-8 text-xs">
                    <div>
                        <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-2">
                            ลูกค้า (Customer / Bill To)
                        </h3>
                        <p className="font-bold text-gray-800 text-sm">{order.customer?.name}</p>
                        <p className="text-gray-600 mt-0.5">เบอร์โทรศัพท์: {order.customer?.phone || '-'}</p>
                        <p className="text-gray-600">อีเมล: {order.customer?.email || '-'}</p>
                        <p className="text-gray-600 mt-1 leading-relaxed">ที่อยู่: {order.customer?.address || '-'}</p>
                    </div>
                    <div className="sm:text-right">
                        <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-2">
                            ข้อมูลคำสั่งซื้อ (Order Info)
                        </h3>
                        <p className="text-gray-600">
                            สถานะพัสดุ:{' '}
                            <span className="font-bold text-gray-900 uppercase">{order.status}</span>
                        </p>
                        <p className="text-gray-600 mt-0.5">
                            พนักงานขาย / ผู้บันทึก: {order.user?.name || 'Admin'}
                        </p>
                        {order.notes && (
                            <p className="text-gray-600 mt-1 italic">
                                หมายเหตุ: {order.notes}
                            </p>
                        )}
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                    <table className="w-full text-xs text-left border-collapse">
                        <thead>
                            <tr className="border-y-2 border-gray-300 bg-gray-50 font-bold text-gray-700">
                                <th className="py-2.5 px-3 w-10 text-center">#</th>
                                <th className="py-2.5 px-3">รายการสินค้า (Description)</th>
                                <th className="py-2.5 px-3 w-28 text-right">ราคา/หน่วย</th>
                                <th className="py-2.5 px-3 w-16 text-center">จำนวน</th>
                                <th className="py-2.5 px-3 w-28 text-right">จำนวนเงิน</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {order.items?.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="py-3 px-3 text-center text-gray-400 font-mono">{index + 1}</td>
                                    <td className="py-3 px-3">
                                        <div className="font-bold text-gray-900">{item.product?.name}</div>
                                        <div className="text-[11px] text-gray-400 font-mono">SKU: {item.product?.sku || '-'}</div>
                                    </td>
                                    <td className="py-3 px-3 text-right font-mono text-gray-700">
                                        {formatCurrency(item.unit_price)}
                                    </td>
                                    <td className="py-3 px-3 text-center font-bold text-gray-900">
                                        {item.quantity}
                                    </td>
                                    <td className="py-3 px-3 text-right font-mono font-semibold text-gray-900">
                                        {formatCurrency(item.subtotal)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className="flex justify-end mb-12">
                    <div className="w-full sm:w-72 text-xs space-y-2 border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-gray-600">
                            <span>ราคาก่อนภาษี (Subtotal):</span>
                            <span className="font-mono">{formatCurrency(netBeforeVat)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>ภาษีมูลค่าเพิ่ม (VAT 7%):</span>
                            <span className="font-mono">{formatCurrency(vat)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t-2 border-gray-900">
                            <span>ยอดเงินสุทธิ (Grand Total):</span>
                            <span className="text-indigo-600 font-mono">{formatCurrency(order.total_amount)}</span>
                        </div>
                    </div>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-12 pt-8 border-t border-dashed border-gray-300 text-xs text-center">
                    <div>
                        <div className="h-16 border-b border-gray-400 mb-2"></div>
                        <p className="font-bold text-gray-800">ลงชื่อผู้รับสินค้า / ลูกค้า</p>
                        <p className="text-gray-400 text-[10px]">วันที่ ..... / ..... / .........</p>
                    </div>
                    <div>
                        <div className="h-16 border-b border-gray-400 mb-2"></div>
                        <p className="font-bold text-gray-800">ลงชื่อผู้รับเงิน / พนักงาน</p>
                        <p className="text-gray-400 text-[10px]">วันที่ ..... / ..... / .........</p>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-8 pt-4 border-t border-gray-100 text-center text-[10px] text-gray-400">
                    เอกสารนี้สร้างขึ้นโดยระบบอัตโนมัติ Sales & Order Management System • พัฒนาด้วย Laravel 12 + React + Inertia + Tailwind CSS
                </div>
            </div>
        </div>
    );
}
