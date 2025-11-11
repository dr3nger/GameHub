import '@/styles/globals.css'; // تم إصلاح المسار هنا

// بيانات الموقع - يتم ضبطها هنا مرة واحدة
export const metadata = {
  title: 'porn4games',
  description: 'The best game hub!',
  icons: {
    icon: '/logo.png', // من مجلد public
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white`}
      >
        {children}
      </body>
    </html>
  );
}