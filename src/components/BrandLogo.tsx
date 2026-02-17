const BrandLogo = ({ size = "default" }: { size?: "default" | "small" }) => {
  const textClass = size === "small" ? "text-lg" : "text-2xl";

  return (
    <span className={`font-display ${textClass} tracking-wider inline-flex items-center gap-1`}>
      <span className="text-foreground">Bring You</span>
      <span className="text-primary inline-flex items-center gap-0.5">
        <span>5</span>
        <span className="inline-block" role="img" aria-label="high five">🖐️</span>
      </span>
    </span>
  );
};

export default BrandLogo;
