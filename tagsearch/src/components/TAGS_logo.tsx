
export default function HeaderLogo() {
  return (
    <div className="relative inline-block text-7xl font-extrabold text-black">
      <span className="relative z-10">TAGSearch</span>
      <svg
        className="absolute bottom-[-2] left-0 w-full h-3 text-red-600"
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
      >
        <path
          d="M0,8 C30,10 70,6 100,8"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    </div>
  );
}