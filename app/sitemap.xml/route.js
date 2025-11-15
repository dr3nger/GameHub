import { supabase } from '@/utils/supabaseClient';

// --- 💡 إضافة جديدة: إجبار الملف على أن يكون ديناميكياً ---
// هذا يمنع Vercel من تخزين نسخة "فاشلة" مؤقتاً
export const revalidate = 0;
// --- نهاية الإضافة ---

const URL = 'https://porn4games.vercel.app';

export default async function sitemap() {
  try {
    // 1. جلب كل الألعاب من قاعدة البيانات
    const { data: games, error } = await supabase
      .from('games')
      .select('id, created_at, updated_at'); // جلب الحقول المطلوبة

    if (error) {
      console.error('Sitemap fetch error:', error.message); // 💡 إضافة لوج للخطأ
      throw new Error(error.message);
    }

    // 2. تحويل بيانات الألعاب إلى مسارات
    const gamePaths = (games || []).map((game) => {
      // 💡 استخدام 'updated_at' إن وجد، وإلا 'created_at'
      const lastModified = game.updated_at
        ? new Date(game.updated_at).toISOString()
        : new Date(game.created_at).toISOString();

      return {
        url: `${URL}/game/${game.id}`,
        lastModified: lastModified,
      };
    });

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
    // 💡 إرجاع مصفوفة فارغة بدلاً من صفحة رئيسية مكررة عند الخطأ
    // هذا قد يساعد جوجل على فهم أن هناك خطأ
    return [];
  }
}