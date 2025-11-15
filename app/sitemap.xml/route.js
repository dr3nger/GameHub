import { supabase } from '@/utils/supabaseClient';

// 💡 غير هذا إلى رابط موقعك الفعلي
const URL = 'https://your-domain.com';

export default async function sitemap() {
  try {
    // 1. جلب كل الألعاب من قاعدة البيانات
    // 💡💡💡 هذا هو السطر الذي تم إصلاحه 💡💡💡
    const { data: games, error } = await supabase
      .from('games')
      .select('id, created_at'); // جلب الحقول المطلوبة فقط

    if (error) {
      throw new Error(error.message);
    }

    // 2. تحويل بيانات الألعاب إلى مسارات
    const gamePaths = (games || []).map((game) => ({
      url: `${URL}/game/${game.id}`,
      lastModified: new Date(game.created_at).toISOString(), // 💡 الأفضل استخدام 'updated_at' إذا كان لديك
    }));

    // 3. إضافة الصفحات الثابتة (مثل الرئيسية)
    const routes = [
      {
        url: URL,
        lastModified: new Date().toISOString(),
      },
    ];

    // 4. دمج الصفحات الثابتة والديناميكية وإرجاعها
    return [...routes, ...gamePaths];

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [
      {
        url: URL,
        lastModified: new Date().toISOString(),
      },
    ];
  }
}

// 💡 ملاحظة: Next.js سيقوم تلقائياً بتحويل هذا إلى ملف XML
// عند زيارة /sitemap.xml