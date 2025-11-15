import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';

// بيانات الموقع - 💡 تم تعديلها لاستخدام قالب العنوان
export const metadata = {
  // 💡 سيتم استخدام هذا العنوان كافتراضي
  title: {
    default: 'Porn Games, Free Adult Sex Games, XXX Fuck Games | Porn4Games',
    template: '%s | porn4games', // %s سيتم استبداله بعنوان الصفحة الفرعية
  },
  description: 'Browse porn and sex game content made for adults. Find porn games, sex games, and new updates daily. Enjoy a simple hub for porn and sex entertainment.',
  // --- 💡 إضافة SEO: الكلمات المفتاحية ---
  keywords: ['porn games', 'free sex games', 'sex animations', 'filter games', 'cartoon porn', 'hentai games', 'online porn games', '3d sex games', 'adult sex games', 'sexgames', 'porngames', 'porn flash games', 'hentai', 'xxx games', 'nsfw games', 'ai sex game', 'ai porn game', 'mobile porn game', 'sex simulator', '18+ RPG games', 'adult games', 'horny game'],
  // --- نهاية الإضافة ---

  // --- 💡💡 إضافة كود التحقق من جوجل 💡💡 ---
  //
  //  <<<<<!! استبدل "YOUR_VERIFICATION_CODE_HERE" بالكود الخاص بك من جوجل !!>>>>>
  //
  verification: {
    google: 'NkgcraDasEkBlEGxR_teZYt5LX1R1xvfWMLwBWvrsLg',
  },
  // --- نهاية الإضافة ---

  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}