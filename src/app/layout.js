import "./globals.css";

export const metadata = {
  title: "CONECTA 2026 — Expo de Negocios B2B | Los Altos de Jalisco",
  description:
    "La expo de negocios B2B más importante de Los Altos de Jalisco. 18 y 19 de Abril 2026 en el Centro de Convenciones Olimpo. Matchmaking inteligente, networking con QR y oportunidades de crecimiento para toda la región.",
  keywords:
    "CONECTA 2026, expo negocios, B2B, Los Altos de Jalisco, Tepatitlán, networking, matchmaking empresarial, Centro de Convenciones Olimpo",
  openGraph: {
    title: "CONECTA 2026 — El Poder de Los Altos Se Conecta Aquí",
    description:
      "La expo de negocios B2B más importante de Los Altos de Jalisco. 18 y 19 de Abril 2026.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
