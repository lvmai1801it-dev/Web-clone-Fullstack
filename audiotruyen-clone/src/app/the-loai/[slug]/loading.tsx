


export default function Loading() {
    return (
        <div className="container-main py-6">
            {/* Breadcrumb Skeleton */}
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>

            <div className="layout-main">
                {/* Main Content Skeleton */}
                <div>
                    {/* Title Skeleton */}
                    <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>

                    {/* Count Skeleton */}
                    <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>

                    {/* Grid Skeleton */}
                    <div className="story-grid mb-8">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-lg aspect-[3/4] animate-pulse"></div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Skeleton */}
                <aside className="space-y-6 hidden lg:block">
                    <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
                </aside>
            </div>
        </div>
    );
}
