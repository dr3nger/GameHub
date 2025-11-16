import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';

// --- 💡 1. تم تطبيق تعديل اسم الموقع هنا ---
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
  verification: {
    google: 'NkgcraDasEkBlEGxR_teZYt5LX1R1xvfWMLwBWvrsLg',
  },

  // --- 💡 2. إضافة اسم الموقع لـ OpenGraph (كما اقترحت الصور) ---
  openGraph: {
    siteName: 'porn4games',
  },
  // --- نهاية الإضافة ---

  icons: {
    icon: '/logo.png',
  },
};

// --- 💡 3. دالة لإنشاء البيانات المنظمة (JSON-LD) ---
// هذا هو الكود الذي سيحل مشكلة اسم "Vercel"
const generateWebSiteSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'porn4games', // <-- هذا هو الاسم الذي سيراه جوجل
    'url': 'https://porn4games.vercel.app',
  };
  return JSON.stringify(schema);
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white`}
      >
        {/* --- 💡 4. إضافة البيانات المنظمة إلى الصفحة --- */}
        {/* هذا الكود هو الذي نصحت به الصور لحل مشكلة اسم "Vercel" */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: generateWebSiteSchema() }}
        />
        {/* --- نهاية الإضافة --- */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}