import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mariadb from 'mariadb';

const pool = mariadb.createPool(process.env.DATABASE_URL!.replace('mysql://', 'mariadb://'));
const adapter = new PrismaMariaDb(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🔍 Testing Data Retrieval...');

    // Lấy 1 truyện bất kỳ đầy đủ thông tin
    const story = await prisma.story.findFirst({
        include: {
            author: true,
            chapters: {
                take: 3, // Lấy thử 3 chương đầu thôi
                orderBy: { number: 'asc' }
            },
            storyGenres: {
                include: { category: true }
            },
            storyTags: {
                include: { tag: true }
            }
        }
    });

    if (!story) {
        console.log('❌ Không tìm thấy truyện nào trong Database!');
        return;
    }

    console.log('✅ Đã tìm thấy truyện:');
    console.log('------------------------------------------------');
    console.log(`📖 Tên: ${story.title}`);
    console.log(`👤 Tác giả: ${story.author.name}`);
    console.log(`📂 Thể loại: ${story.storyGenres.map(sg => sg.category.name).join(', ')}`);
    console.log(`🏷️ Tags: ${story.storyTags.map(st => st.tag.name).join(', ')}`);
    console.log(`📄 Số tập: ${story.totalChapters} (Hiển thị 3 tập đầu)`);

    story.chapters.forEach(chap => {
        console.log(`   - Bài ${chap.number}: ${chap.title} (${chap.audioUrl})`);
    });
    console.log('------------------------------------------------');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
