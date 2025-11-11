// هذا الملف يحتوي على الأيقونات المخصصة
// لتنظيم الكود

export const CustomGameIcon = ({ className }) => {
  return (
    <img
      src="/logo.png"
      alt="Site Logo"
      className={className}
      style={{ objectFit: 'contain' }}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = 'https://placehold.co/40x40/4a0e71/ffffff?text=LOGO';
      }}
    />
  );
};

export const RedditIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <text
      x="50%"
      y="50%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontSize="14"
      fontWeight="bold"
      fill="currentColor"
    >
      R
    </text>
  </svg>
);