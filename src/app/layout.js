import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit',
});

export const metadata = {
  title: "CONECTA 2026 — Conexiones y Oportunidades de Negocio | Sede 2026 Tepatitlán de Morelos",
  description:
    "El evento diseñado para conectar empresas y generar oportunidades de negocio en la región. Sede 2026: Tepatitlán de Morelos. 18 y 19 de Abril en el Centro de Convenciones Olimpo. Encuentros estratégicos, networking eficaz y crecimiento.",
  keywords:
    "CONECTA 2026, negocios, conexiones empresariales, Sede 2026 Tepatitlán de Morelos, networking, oportunidades de negocio, Centro de Convenciones Olimpo",
  openGraph: {
    title: "CONECTA 2026 — El Poder de la Región Se Conecta Aquí",
    description:
      "El principal encuentro para conectar empresas y hacer negocios. Sede 2026: Tepatitlán de Morelos. 18 y 19 de Abril.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={outfit.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
