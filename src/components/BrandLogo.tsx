import logoImage from "@/assets/bring-your-five-logo.jpeg";

const BrandLogo = ({ size = "default" }: { size?: "default" | "small" }) => {
  const imgClass = size === "small" ? "w-8 h-8" : "w-10 h-10";
  const textClass = size === "small" ? "text-lg" : "text-2xl";

  return (
    <span className={`font-display ${textClass} tracking-wider inline-flex items-center gap-2`}>
      <img src={logoImage} alt="Bring Your Five" className={`${imgClass} rounded-full object-cover`} />
      <span className="text-foreground">Bring Your</span>
      <span className="text-primary">Five</span>
    </span>
  );
};

export default BrandLogo;
