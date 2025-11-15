import { supabase } from '@/utils/supabaseClient';

// --- 💡 إضافة جديدة: إجبار الملف على أن يكون ديناميكياً ---
export const revalidate = 0;
// --- نهاية الإضافة ---

const URL = 'https://porn4games.vercel.app';

export default async function sitemap() {
  try {
    // 1. جلب كل الألعاب من قاعدة البيانات
    // 💡 --- تم التعديل هنا: إزالة updated_at ---
    // هذا يضمن نجاح الطلب حتى لو كان الحقل غير موجود
    const { data: games, error } = await supabase
      .from('games')
      .select('id, created_at'); // جلب الحقول المطلوبة فقط

    if (error) {
      console.error('Sitemap fetch error:', error.message); // 💡 إضافة لوج للخطأ
      throw new Error(error.message);
    }

    // 2. تحويل بيانات الألعاب إلى مسارات
    const gamePaths = (games || []).map((game) => {
      // 💡 --- تم التعديل هنا: استخدام created_at دائماً ---
      const lastModified = new Date(game.created_at).toISOString();

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
    return [];
  }
}