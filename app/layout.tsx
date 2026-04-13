import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tchokos SARL - Chaussures et Accessoires de Mode",
  description: "Boutique de chaussures et accessoires de mode premium au Cameroun. Découvrez notre collection homme, femme et enfant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="font-sans">
      <body className="font-sans antialiased min-h-screen flex flex-col bg-gray-50">
        <Toaster position="top-center" toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#D4AF37',
              secondary: '#111',
            },
          },
        }} />
        {children}
      </body>
    </html>
  );
}
