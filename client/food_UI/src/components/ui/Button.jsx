function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
}) {

  const variants = {
    primary:
      "bg-coral text-white border-ink hover:bg-teal",

    success:
      "bg-teal text-white border-ink hover:bg-coral",

    danger:
      "bg-red-500 text-white border-ink hover:bg-red-600",

    outline:
      "bg-white text-ink border-ink hover:bg-sunny/40",
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
        rounded-2xl
        border-2
        font-display
        font-bold
        shadow-chunky-sm
        hover:-translate-y-0.5
        hover:shadow-chunky
        active:translate-y-0
        active:shadow-chunky-sm
        transition-all
        duration-200
      `}
    >
      {children}
    </button>
  );
}

export default Button;
