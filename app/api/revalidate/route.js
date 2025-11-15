import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

// دالة POST للتعامل مع طلبات إعادة التحقق
export async function POST(request) {
  try {
    // 💡 1. قراءة ID اللعبة من الطلب
    // الكود في 'app/dashboard/page.js' يرسل هذا الـ ID الآن
    const { gameId } = await request.json();

    const revalidatedPaths = [];

    // 💡 2. تحديث الصفحة الرئيسية (دائماً)
    revalidatePath('/');
    revalidatedPaths.push('/');

    // 💡 3. تحديث صفحة اللعبة (فقط إذا تم إرسال ID)
    if (gameId) {
      const gamePath = `/game/${gameId}`;
      revalidatePath(gamePath);
      revalidatedPaths.push(gamePath);
    }

    // إرجاع رد ناجح
    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      revalidatedPaths: revalidatedPaths, // <-- لإعطاء تأكيد
    });
    
  } catch (err) {
    // إرجاع رد في حالة الفشل
    console.error('Error revalidating:', err);
    return NextResponse.json(
      {
        revalidated: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}