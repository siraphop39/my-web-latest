import React from 'react';
import { Head } from '@inertiajs/react';

export default function Quiz4() {
    const data = [
        { id: 1, name: 'The Eras Tour', artist: 'Taylor Swift', price: '8,000 ฿', sold: 1500, venue: 'Rajamangala National Stadium' },
        { id: 2, name: 'BORN PINK World Tour', artist: 'BLACKPINK', price: '6,500 ฿', sold: 1000, venue: 'National Stadium' },
        { id: 3, name: 'Music of the Spheres', artist: 'Coldplay', price: '5,500 ฿', sold: 1500, venue: 'Rajamangala National Stadium' },
        { id: 4, name: 'The Mathematics Tour', artist: 'Ed Sheeran', price: '4,500 ฿', sold: 1000, venue: 'Impact Arena' },
        { id: 5, name: 'GUTS World Tour', artist: 'Olivia Rodrigo', price: '3,500 ฿', sold: 500, venue: 'Impact Arena' },
        { id: 6, name: 'Bruno Mars Live in Bangkok', artist: 'Bruno Mars', price: '7,500 ฿', sold: 1500, venue: 'Rajamangala National Stadium' },
        { id: 7, name: 'NCT DREAM TOUR', artist: 'NCT DREAM', price: '4,000 ฿', sold: 1000, venue: 'Impact Arena' },
    ];

    return (
        <div className="min-h-screen bg-white p-8 font-sans">
            <Head title="Quiz 4 - Concert List" />
            <div className="max-w-[1200px] mx-auto">
                <h1 className="text-xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-500 pb-2 inline-block">
                    ตารางรายชื่อคอนเสิร์ต (Quiz 4)
                </h1>
                
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="w-full text-left text-[14px]">
                        <thead className="bg-indigo-50">
                            <tr className="border-b-2 border-indigo-100">
                                <th className="py-4 px-6 font-bold text-gray-900 w-[5%] text-center">ID</th>
                                <th className="py-4 px-6 font-bold text-gray-900 w-[25%]">ชื่อคอนเสิร์ต (Concert Name)</th>
                                <th className="py-4 px-6 font-bold text-gray-900 w-[15%]">ศิลปิน (Artist)</th>
                                <th className="py-4 px-6 font-bold text-gray-900 w-[10%]">ราคาบัตร (Price)</th>
                                <th className="py-4 px-6 font-bold text-gray-900 w-[15%] text-center">จำนวนที่ขาย (Sold)</th>
                                <th className="py-4 px-6 font-bold text-gray-900">สถานที่จัดงาน (Venue)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map((item, index) => (
                                <tr key={item.id} className={`hover:bg-indigo-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                    <td className="py-4 px-6 font-medium text-gray-900 text-center">{item.id}</td>
                                    <td className="py-4 px-6 text-gray-800 font-semibold">{item.name}</td>
                                    <td className="py-4 px-6 text-indigo-600 font-medium">{item.artist}</td>
                                    <td className="py-4 px-6 text-emerald-600 font-semibold">{item.price}</td>
                                    <td className="py-4 px-6 text-gray-600 text-center">
                                        <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-xs font-semibold">
                                            {item.sold} ใบ
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-gray-500">{item.venue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
