<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1080" height="1920" viewBox="0 0 1080 1920" font-family="Arial, Helvetica, sans-serif">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="40%" r="62%">
      <stop offset="0%" stop-color="#3a2a14"/>
      <stop offset="45%" stop-color="#1c130b"/>
      <stop offset="100%" stop-color="#0a0705"/>
    </radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fdeec0"/>
      <stop offset="35%" stop-color="#e8c074"/>
      <stop offset="70%" stop-color="#bd8a34"/>
      <stop offset="100%" stop-color="#8a5e1f"/>
    </linearGradient>
    <linearGradient id="goldBright" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fff4cf"/>
      <stop offset="100%" stop-color="#e0ab51"/>
    </linearGradient>
    <linearGradient id="goldBar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#b8862f"/>
      <stop offset="50%" stop-color="#f3d488"/>
      <stop offset="100%" stop-color="#b8862f"/>
    </linearGradient>
    <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="10" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="45" result="b"/>
      <feMerge><feMergeNode in="b"/></feMerge>
    </filter>
    <filter id="prodShadow" x="-40%" y="-20%" width="180%" height="160%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1080" height="1920" fill="url(#bgGlow)"/>
  <g opacity="0.08" stroke="#e8c074" stroke-width="3">
    <line x1="-100" y1="500" x2="600" y2="-100"/>
    <line x1="200" y1="700" x2="1000" y2="-150"/>
    <line x1="500" y1="2000" x2="1200" y2="1100"/>
    <line x1="120" y1="2000" x2="820" y2="1100"/>
  </g>
  <ellipse cx="610" cy="1000" rx="350" ry="430" fill="#c8923a" opacity="0.22" filter="url(#softGlow)"/>

  <!-- ===== TITLE ===== -->
  <text x="540" y="150" text-anchor="middle" fill="url(#gold)" font-size="96" font-weight="800" letter-spacing="6" stroke="#7a531c" stroke-width="1">MASTERCLASS</text>
  <line x1="190" y1="180" x2="890" y2="180" stroke="url(#goldBar)" stroke-width="2"/>

  <g transform="translate(70,235)">
    <text x="0" y="0" fill="#f5ecd8" font-size="34" font-weight="800">Kanstantsin Maksimchyk</text>
    <text x="2" y="34" fill="#c8923a" font-size="22" font-weight="600">@kostya.maksimchik</text>
  </g>
  <g transform="translate(1010,235)">
    <text x="0" y="0" text-anchor="end" fill="url(#goldBright)" font-size="40" font-weight="900">21 IUNIE</text>
    <text x="0" y="34" text-anchor="end" fill="#f5ecd8" font-size="24" font-weight="600" letter-spacing="3">CHIȘINĂU</text>
  </g>

  <!-- ===== CONCURS BANNER ===== -->
  <g transform="translate(310,320)">
    <rect x="0" y="0" width="460" height="74" rx="6" fill="url(#goldBar)"/>
    <text x="230" y="52" text-anchor="middle" fill="#1a120a" font-size="46" font-weight="900" letter-spacing="6">CONCURS</text>
  </g>
  <text x="540" y="438" text-anchor="middle" fill="#cdb98f" font-size="26" font-weight="600" letter-spacing="2">pentru toți participanții la Masterclass</text>

  <!-- ===== HEADLINE ===== -->
  <g transform="translate(540,500)">
    <text x="0" y="0" text-anchor="middle" fill="#f5ecd8" font-size="56" font-weight="900" font-style="italic">VINO ȘI</text>
    <text x="0" y="118" text-anchor="middle" fill="url(#gold)" font-size="150" font-weight="900" font-style="italic" letter-spacing="-3" filter="url(#glow)">CÂȘTIGĂ</text>
    <text x="0" y="180" text-anchor="middle" fill="#f5ecd8" font-size="50" font-weight="900" font-style="italic">PREMII JRL!</text>
  </g>

  <!-- ===== PRODUCT PHOTOS (real JRL machines) ===== -->
  <image x="429" y="704" width="263" height="580" filter="url(#prodShadow)" xlink:href="__CLIPPER__"/>
  <image x="708" y="744" width="225" height="500" filter="url(#prodShadow)" xlink:href="__TRIMMER__"/>

  <!-- ===== PRIZE BOX (left) ===== -->
  <g transform="translate(60,1000)">
    <rect x="0" y="0" width="358" height="250" rx="18" fill="#160f08" stroke="url(#goldBar)" stroke-width="2"/>
    <text x="30" y="54" fill="#cdb98f" font-size="28" font-weight="700" letter-spacing="1">MARELE PREMIU</text>
    <text x="28" y="138" fill="url(#gold)" font-size="92" font-weight="900" font-style="italic" filter="url(#glow)">LOC 1</text>
    <text x="30" y="184" fill="#ffffff" font-size="29" font-weight="800">MAȘINĂ DE TUNS JRL</text>
    <text x="30" y="222" fill="#e8c074" font-size="29" font-weight="800">+ TRIMER JRL</text>
  </g>

  <!-- ===== BULLET FEATURES ===== -->
  <g transform="translate(0,1500)">
    <line x1="60" y1="-20" x2="1020" y2="-20" stroke="#3a2c18" stroke-width="2"/>
    <g transform="translate(180,60)">
      <circle cx="0" cy="0" r="40" fill="none" stroke="url(#goldBar)" stroke-width="3"/>
      <path d="M -18 2 L -5 16 L 20 -14" fill="none" stroke="#e8c074" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="0" y="80" text-anchor="middle" fill="#ffffff" font-size="22" font-weight="800">O NOUĂ VIZIUNE</text>
      <text x="0" y="108" text-anchor="middle" fill="#a89472" font-size="18">ÎMPREUNĂ CREĂM</text>
    </g>
    <g transform="translate(540,60)">
      <circle cx="0" cy="0" r="40" fill="none" stroke="url(#goldBar)" stroke-width="3"/>
      <path d="M -18 2 L -5 16 L 20 -14" fill="none" stroke="#e8c074" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="0" y="80" text-anchor="middle" fill="#ffffff" font-size="22" font-weight="800">CUNOAȘTEREA</text>
      <text x="0" y="108" text-anchor="middle" fill="#a89472" font-size="18">STILULUI</text>
    </g>
    <g transform="translate(900,60)">
      <circle cx="0" cy="0" r="40" fill="none" stroke="url(#goldBar)" stroke-width="3"/>
      <path d="M -18 2 L -5 16 L 20 -14" fill="none" stroke="#e8c074" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="0" y="80" text-anchor="middle" fill="#ffffff" font-size="22" font-weight="800">2 DEMO-TUNSORI</text>
      <text x="0" y="108" text-anchor="middle" fill="#a89472" font-size="18">LIVE PE SCENĂ</text>
    </g>
  </g>

  <!-- ===== FOOTER ===== -->
  <g transform="translate(0,1730)">
    <rect x="0" y="0" width="1080" height="190" fill="#0d0906"/>
    <line x1="0" y1="0" x2="1080" y2="0" stroke="url(#goldBar)" stroke-width="2"/>
    <g transform="translate(150,95)">
      <text x="0" y="0" text-anchor="middle" fill="url(#gold)" font-size="58" font-weight="900">360°</text>
      <text x="0" y="34" text-anchor="middle" fill="#cdb98f" font-size="22" font-weight="600" letter-spacing="6">ACADEMY</text>
    </g>
    <g transform="translate(540,80)">
      <rect x="-24" y="-24" width="48" height="48" rx="14" fill="none" stroke="#e8c074" stroke-width="3"/>
      <circle cx="0" cy="0" r="12" fill="none" stroke="#e8c074" stroke-width="3"/>
      <circle cx="14" cy="-14" r="3.5" fill="#e8c074"/>
      <text x="0" y="56" text-anchor="middle" fill="#f5ecd8" font-size="22" font-weight="700">@kostya.maksimchik</text>
    </g>
    <g transform="translate(910,95)">
      <text x="0" y="0" text-anchor="middle" fill="#ffffff" font-size="50" font-weight="900" letter-spacing="2">SELECT</text>
      <text x="0" y="34" text-anchor="middle" fill="#cdb98f" font-size="22" font-weight="600" letter-spacing="6">ACADEMY</text>
    </g>
  </g>
</svg>
