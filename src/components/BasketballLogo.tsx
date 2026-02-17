const BasketballLogo = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Basketball circle */}
      <circle
        cx="200"
        cy="200"
        r="160"
        fill="hsl(25, 85%, 45%)"
        stroke="hsl(25, 60%, 25%)"
        strokeWidth="5"
      />

      {/* Basketball seam lines */}
      {/* Vertical line */}
      <path
        d="M200 40 Q200 200 200 360"
        fill="none"
        stroke="hsl(25, 60%, 25%)"
        strokeWidth="3"
      />
      {/* Horizontal line */}
      <path
        d="M40 200 Q200 200 360 200"
        fill="none"
        stroke="hsl(25, 60%, 25%)"
        strokeWidth="3"
      />
      {/* Left curve */}
      <path
        d="M120 50 Q80 200 120 350"
        fill="none"
        stroke="hsl(25, 60%, 25%)"
        strokeWidth="3"
      />
      {/* Right curve */}
      <path
        d="M280 50 Q320 200 280 350"
        fill="none"
        stroke="hsl(25, 60%, 25%)"
        strokeWidth="3"
      />

      {/* "BRING YOUR" text along top arc */}
      <defs>
        <path
          id="topArc"
          d="M80 220 A150 150 0 0 1 320 220"
        />
      </defs>
      <text
        fill="hsl(40, 20%, 95%)"
        fontSize="36"
        fontFamily="Oswald, sans-serif"
        fontWeight="700"
        letterSpacing="8"
        textAnchor="middle"
      >
        <textPath href="#topArc" startOffset="50%">
          BRING YOUR
        </textPath>
      </text>

      {/* Hand emoji - centered, large */}
      <text
        x="200"
        y="230"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="100"
        role="img"
        aria-label="high five hand"
      >
        🖐️
      </text>
    </svg>
  );
};

export default BasketballLogo;
