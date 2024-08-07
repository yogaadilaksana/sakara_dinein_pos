import "@/app/_styles/global.css";
import { Poppins } from "next/font/google";
import Footer from "./_components/_dashboard/Footer";
import SessionProviderWrapper from "./_components/SessionProviderWrapper"; // Import the wrapper
import { AuthProvider } from '@/app/_contexts/AuthContext';

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Selamat Datang | Sakara Kopi Bali",
  description:
    "Dashboard dan website Sakara Kopi Bali, tempat bersantai sambil menikmati kopi di daerah Denpasar Utara, Bali. Tempat yang nyaman dan luas bisa menjadi tempat kerja terbaikmu sambil menikmati berbagai menu yang lezat dengan harga terjangkau",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} flex flex-col min-h-screen bg-bcprimary`}
      >
        <SessionProviderWrapper> {/* Use the wrapper here */}
          <AuthProvider> {/* Wrap with AuthProvider */}
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
