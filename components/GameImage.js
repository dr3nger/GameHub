"use client";

// هذا مكون عميل جديد ومخصص لعرض الصور مع معالجة الخطأ
export default function GameImage({ src, alt, className, errorSrc }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.target.onerror = null; // يمنع تكرار الحدث
        e.target.src = errorSrc; // يعرض الصورة البديلة
      }}
    />
  );
}