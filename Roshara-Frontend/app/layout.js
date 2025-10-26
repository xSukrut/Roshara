import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import Navbar from "./components/Navbar";
import ShowMiniCart from "./components/ShowMiniCart";

export const metadata = {
  title: "Roshara",
  description: "Luxury fashion store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <ShowMiniCart />
            <main className="pt-16">{children}</main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
