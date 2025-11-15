import { supabase } from '@/utils/supabaseClient';

// --- 💡 إجبار الملف على أن يكون ديناميكياً ---
export const revalidate = 0;

const URL = 'https://porn4games.vercel.app';

// --- 💡 دالة لإنشاء نص الـ XML ---
function generateSitemapXml(games) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // 1. إضافة الصفحة الرئيسية
  xml += `
    <url>
      <loc>${URL}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>1.0</priority>
    </url>
  `;

  // 2. إضافة كل الألعاب
  (games || []).forEach((game) => {
    const lastModified = new Date(game.created_at).toISOString();
    xml += `
      <url>
        <loc>${URL}/game/${game.id}</loc>
        <lastmod>${lastModified}</lastmod>
        <priority>0.8</priority>
      </url>
    `;
  });

  xml += `</urlset>`;
  return xml;
}

// --- 💡 1. تم تغيير اسم الدالة إلى GET (لحل خطأ 405) ---
export async function GET() {
  try {
    // جلب كل الألعاب من قاعدة البيانات
    const { data: games, error } = await supabase
      .from('games')
      .select('id, created_at');

    if (error) {
      console.error('Sitemap fetch error:', error.message);
      throw new Error(error.message);
    }

    // إنشاء نص الـ XML
    const xmlString = generateSitemapXml(games);

    // --- 💡 2. إرجاع رد (Response) صحيح ---
    return new Response(xmlString, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=0, stale-while-revalidate', // التحكم بالكاش
      },
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    // إرجاع خطأ في الخادم
    return new Response('<error>Could not generate sitemap</error>', {
      status: 500,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}