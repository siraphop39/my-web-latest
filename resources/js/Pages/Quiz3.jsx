import React, { useState } from 'react';
import { Head } from '@inertiajs/react';

export default function Quiz3() {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <Head title="Quiz 3" />
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-10 max-w-[400px] w-full text-center">
                <h1 className="text-[22px] font-bold text-gray-800 mb-6">ประเมินบริการของเรา</h1>
                
                <div className="flex justify-center gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                        >
                            <svg 
                                className={`w-12 h-12 transition-colors duration-200 ${
                                    star <= (hover || rating) ? 'text-gray-400 fill-current' : 'text-gray-200 fill-current'
                                }`} 
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </button>
                    ))}
                </div>

                <p className="text-gray-400 mb-8 text-[15px]">คลิกเพื่อประเมินความพึงพอใจ</p>
                
                <button 
                    disabled={rating === 0}
                    className={`font-medium py-3.5 px-6 rounded-full w-full transition-all duration-300 flex items-center justify-center gap-2 text-[15px] ${
                        rating > 0 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 cursor-pointer' 
                            : 'bg-[#8b939c] text-white cursor-not-allowed opacity-90'
                    }`}
                >
                    ส่งความพึงพอใจ 🚀
                </button>
            </div>
        </div>
    );
}
