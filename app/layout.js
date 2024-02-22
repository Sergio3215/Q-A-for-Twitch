import { Inter } from "next/font/google";
import "./globals.css";
import "../public/charlie-brown.svg"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Preguntas y Respuestas para Twitch",
  description: "Juego en Twitch para todo el mundo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className} style={{
            margin:'0',
            padding: '0',
      }}>
        {children}
      </body>
    </html>
  );
}
