import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ orders = { data: [], links: [] }, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('orders.index'), { search, status: statusFilter }, { preserveState: true });
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        router.get(route('orders.index'), { search, status }, { preserveState: true });
    };

    const handleQuickStatusChange = (orderId, newStatus) => {
        router.patch(route('orders.update-status', orderId), { status: newStatus }, {
            preserveScroll: true,
        });
    };

    const handleDelete = (order) => {
        if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบใบสั่งซื้อ ${order.order_number}?`)) {
            router.delete(route('orders.destroy', order.id));
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                        <span className="w-1.5 h-1.5 mr-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                        รอดำเนินการ (Pending)
                    </span>
                );
            case 'Shipped':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                        <span className="w-1.5 h-1.5 mr-1.5 bg-blue-500 rounded-full"></span>
                        จัดส่งแล้ว (Shipped)
                    </span>
                );
            case 'Delivered':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full"></span>
                        สำเร็จ (Delivered)
                    </span>
                );
            case 'Cancelled':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                        ยกเลิก (Cancelled)
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                        {status || 'Pending'}
                    </span>
                );
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount || 0);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 leading-tight">
                            ระบบจัดการการขายและใบสั่งซื้อ (Sales & Order Management System)
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            ผู้จัดทำ: รัชชานนท์ ช่วยบุญ, สิระภพ นาคคำ
                        </p>
                    </div>
                    <Link
                        href={route('orders.create')}
                        className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition duration-150 ease-in-out gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        สร้างใบสั่งซื้อใหม่
                    </Link>
                </div>
            }
        >
            <Head title="ระบบจัดการคำสั่งซื้อ" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* KPI Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">คำสั่งซื้อทั้งหมด</div>
                        <div className="mt-2 text-2xl font-bold text-gray-900">{stats?.total_orders || 0} รายการ</div>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-amber-100 bg-gradient-to-br from-white to-amber-50/40">
                        <div className="text-xs font-medium text-amber-700 uppercase tracking-wider">รอดำเนินการ (Pending)</div>
                        <div className="mt-2 text-2xl font-bold text-amber-600">{stats?.pending_count || 0} รายการ</div>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-blue-100 bg-gradient-to-br from-white to-blue-50/40">
                        <div className="text-xs font-medium text-blue-700 uppercase tracking-wider">จัดส่งแล้ว (Shipped)</div>
                        <div className="mt-2 text-2xl font-bold text-blue-600">{stats?.shipped_count || 0} รายการ</div>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40">
                        <div className="text-xs font-medium text-emerald-700 uppercase tracking-wider">ส่งมอบสำเร็จ (Delivered)</div>
                        <div className="mt-2 text-2xl font-bold text-emerald-600">{stats?.delivered_count || 0} รายการ</div>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/40">
                        <div className="text-xs font-medium text-indigo-700 uppercase tracking-wider">ยอดขายรวมทั้งหมด</div>
                        <div className="mt-2 text-xl font-bold text-indigo-600">{formatCurrency(stats?.total_revenue || 0)}</div>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Status Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        <button
                            onClick={() => handleStatusFilter('')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                statusFilter === '' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            ทั้งหมด ({stats?.total_orders || 0})
                        </button>
                        <button
                            onClick={() => handleStatusFilter('Pending')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                statusFilter === 'Pending' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            }`}
                        >
                            Pending ({stats?.pending_count || 0})
                        </button>
                        <button
                            onClick={() => handleStatusFilter('Shipped')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                statusFilter === 'Shipped' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            }`}
                        >
                            Shipped ({stats?.shipped_count || 0})
                        </button>
                        <button
                            onClick={() => handleStatusFilter('Delivered')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                statusFilter === 'Delivered' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                        >
                            Delivered ({stats?.delivered_count || 0})
                        </button>
                    </div>

                    {/* Search Input */}
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="ค้นหาเลขที่, ชื่อลูกค้า, เบอร์โทร..."
                                className="w-full text-xs rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 pr-8"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        router.get(route('orders.index'), { status: statusFilter });
                                    }}
                                    className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 text-xs"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="px-3 py-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold rounded-lg"
                        >
                            ค้นหา
                        </button>
                    </form>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                            <thead className="bg-gray-50/75 text-xs uppercase font-semibold text-gray-500">
                                <tr>
                                    <th scope="col" className="px-6 py-3.5">เลขที่ใบสั่งซื้อ</th>
                                    <th scope="col" className="px-6 py-3.5">ลูกค้า</th>
                                    <th scope="col" className="px-6 py-3.5">วันที่</th>
                                    <th scope="col" className="px-6 py-3.5">รายการสินค้า</th>
                                    <th scope="col" className="px-6 py-3.5">ยอดรวม</th>
                                    <th scope="col" className="px-6 py-3.5">สถานะ</th>
                                    <th scope="col" className="px-6 py-3.5 text-right">การกระทำ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {orders.data.length > 0 ? (
                                    orders.data.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/60 transition">
                                            <td className="px-6 py-4 font-mono font-medium text-indigo-600 whitespace-nowrap">
                                                <Link href={route('orders.show', order.id)} className="hover:underline">
                                                    {order.order_number}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{order.customer?.name}</div>
                                                <div className="text-xs text-gray-500">{order.customer?.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                {order.order_date || new Date(order.created_at).toLocaleDateString('th-TH')}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                <span className="font-medium text-gray-800">{order.items?.length || 0} ชิ้น</span>
                                                <div className="text-xs text-gray-400 truncate max-w-xs">
                                                    {order.items?.map(i => i.product?.name).join(', ')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                                                {formatCurrency(order.total_amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    {getStatusBadge(order.status)}
                                                    {/* Quick status dropdown */}
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleQuickStatusChange(order.id, e.target.value)}
                                                        className="text-xs py-0.5 px-2 border-gray-200 rounded text-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap text-xs font-medium space-x-2">
                                                <Link
                                                    href={route('orders.receipt', order.id)}
                                                    target="_blank"
                                                    title="พิมพ์ใบเสร็จ PDF"
                                                    className="inline-flex items-center px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded border border-amber-200"
                                                >
                                                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                                    </svg>
                                                    ใบเสร็จ PDF
                                                </Link>
                                                <Link
                                                    href={route('orders.show', order.id)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    ดู
                                                </Link>
                                                <Link
                                                    href={route('orders.edit', order.id)}
                                                    className="text-gray-600 hover:text-gray-900"
                                                >
                                                    แก้ไข
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(order)}
                                                    className="text-rose-600 hover:text-rose-900"
                                                >
                                                    ลบ
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            ไม่พบข้อมูลใบสั่งซื้อตามเงื่อนไข
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {orders.links && orders.links.length > 3 && (
                        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                                แสดง {orders.from || 0} ถึง {orders.to || 0} จากทั้งหมด {orders.total} รายการ
                            </div>
                            <div className="flex gap-1">
                                {orders.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 text-xs rounded border ${
                                            link.active
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : link.url
                                                ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
