import Link from 'next/link';
import { mockCategories } from '@/lib/mock-data';

export default function CategoriesPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 py-8 mb-8">
                <div className="container-main">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Thể Loại Truyện</h1>
                    <p className="text-gray-500">Khám phá kho truyện audio phong phú với đa dạng thể loại hấp dẫn.</p>
                </div>
            </div>

            <div className="container-main">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {mockCategories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/the-loai/${category.slug}`}
                            className="group block bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-blue-100 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                    {category.storyCount.toLocaleString()} truyện
                                </span>
                            </div>

                            <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {category.name}
                            </h2>
                            <p className="text-sm text-gray-500 line-clamp-2">
                                Tổng hợp truyện {category.name} chọn lọc hay nhất, cập nhật liên tục mỗi ngày.
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
