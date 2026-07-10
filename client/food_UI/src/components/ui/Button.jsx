function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
}) {

  const variants = {
    primary:
      "bg-orange-500 hover:bg-orange-600 text-white",

    success:
      "bg-green-500 hover:bg-green-600 text-white",

    danger:
      "bg-red-500 hover:bg-red-600 text-white",

    outline:
      "border border-orange-500 text-orange-500 hover:bg-orange-50",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",

    md: "px-5 py-3",

    lg: "px-7 py-4 text-lg",
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-xl
        font-semibold
        shadow-md
        hover:shadow-xl
        transition-all
        duration-300
      `}
    >
      {children}
    </button>
  );
}

export default Button;