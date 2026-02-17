const BasketballLogo = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 400 520"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* "BRING YOUR" arched above the basketball */}
      <defs>
        <path
          id="topArc"
          d="M40 200 A190 190 0 0 1 360 200"
        />
        <path
          id="bottomArc"
          d="M60 330 A175 175 0 0 0 340 330"
        />
      </defs>
      <text
        fill="hsl(40, 20%, 95%)"
        fontSize="40"
        fontFamily="Oswald, sans-serif"
        fontWeight="700"
        letterSpacing="10"
        textAnchor="middle"
      >
        <textPath href="#topArc" startOffset="50%">
          BRING YOUR
        </textPath>
      </text>

      {/* Basketball circle */}
      <circle
        cx="200"
        cy="260"
        r="120"
        fill="hsl(25, 85%, 45%)"
        stroke="hsl(25, 60%, 25%)"
        strokeWidth="5"
      />

      {/* Basketball seam lines */}
      <path d="M200 140 Q200 260 200 380" fill="none" stroke="hsl(25, 60%, 25%)" strokeWidth="3" />
      <path d="M80 260 Q200 260 320 260" fill="none" stroke="hsl(25, 60%, 25%)" strokeWidth="3" />
      <path d="M145 150 Q110 260 145 370" fill="none" stroke="hsl(25, 60%, 25%)" strokeWidth="3" />
      <path d="M255 150 Q290 260 255 370" fill="none" stroke="hsl(25, 60%, 25%)" strokeWidth="3" />

      {/* Hand emoji centered */}
      <text
        x="200"
        y="270"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="85"
        role="img"
        aria-label="high five hand"
      >
        🖐️
      </text>

      {/* "FIVE" arched below the basketball */}
      <text
        fill="hsl(40, 20%, 95%)"
        fontSize="46"
        fontFamily="Oswald, sans-serif"
        fontWeight="700"
        letterSpacing="16"
        textAnchor="middle"
      >
        <textPath href="#bottomArc" startOffset="50%">
          FIVE
        </textPath>
      </text>
    </svg>
  );
};

export default BasketballLogo;
