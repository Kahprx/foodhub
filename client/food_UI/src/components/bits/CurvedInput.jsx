function CurvedInput({
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  className = "",
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full rounded-2xl border-2 border-ink bg-white px-5 py-3.5 font-semibold shadow-chunky-sm outline-none transition focus:shadow-chunky placeholder:text-ink/40 ${className}`}
    />
  );
}

export default CurvedInput;
