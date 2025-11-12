import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

// دالة POST للتعامل مع طلبات إعادة التحقق
export async function POST(request) {
  try {
    // إعادة التحقق من الصفحة الرئيسية
    revalidatePath('/');

    // (اختياري) يمكنك إضافة صفحات أخرى هنا إذا أردت
    // revalidatePath('/game/[id]', 'page');

    // إرجاع رد ناجح
    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
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