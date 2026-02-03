import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-background/80 backdrop-blur-sm border-t border-border mt-8">
            <div className="container-main py-8">
                <div className="text-center text-sm text-muted-foreground">
                    {/* Site Description */}
                    <p className="mb-4 text-foreground/80 font-medium">
                        AudioTruyen.org - Website nghe truyện audio online miễn phí.
                        Tất cả các tệp âm thanh được tạo bằng phần mềm Text-to-Speech (TTS).
                    </p>

                    {/* Browser Compatibility */}
                    <p className="mb-6 opacity-80">
                        Khuyến nghị sử dụng Mozilla Firefox hoặc Google Chrome để có trải nghiệm tốt nhất.
                    </p>

                    {/* DMCA & Copyright */}
                    <div className="flex items-center justify-center gap-4 flex-wrap mb-6">
                        {/* DMCA Badge */}
                        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                            </svg>
                            DMCA Protected
                        </div>

                        {/* Divider */}
                        <span className="text-border">|</span>

                        {/* Copyright */}
                        <p>
                            © {new Date().getFullYear()} AudioTruyen Clone. All rights reserved.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex items-center justify-center gap-6 text-xs font-medium">
                        <Link href="/gioi-thieu" className="hover:text-primary transition-colors">
                            Giới thiệu
                        </Link>
                        <span className="text-border">•</span>
                        <Link href="/lien-he" className="hover:text-primary transition-colors">
                            Liên hệ
                        </Link>
                        <span className="text-border">•</span>
                        <Link href="/chinh-sach" className="hover:text-primary transition-colors">
                            Chính sách
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
