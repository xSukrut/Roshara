import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";
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
          <WishlistProvider>
            <CartProvider>
              <Navbar />
              <ShowMiniCart />
              <main className="pt-16">{children}</main>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
