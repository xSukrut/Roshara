// app/components/Navbar.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Heart, ShoppingBag, User } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // scroll listener → fade to solid on home
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { user, logout } = useAuth();

  let cartItems = [];
  try {
    cartItems = useCart()?.items || [];
  } catch {
    cartItems = [];
  }
  const cartCount = cartItems.reduce((sum, it) => sum + (it.qty || 0), 0);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "New Arrivals", path: "/new-arrivals", dropdown: [] },
    { name: "Shop All", path: "/shop", dropdown: [] },
    { name: "Collections", path: "/collections", dropdown: [] },
    { name: "Our Story", path: "/about", dropdown: [] },
    { name: "Contact Us", path: "/contact", dropdown: [] },
  ];

  // appearance logic
  const isTransparent = isHome && !scrolled;
  const textClass = isTransparent ? "text-white" : "text-black";
  const hoverClass = isTransparent ? "hover:text-gray-300" : "hover:text-gray-700";
  const frameClass = isTransparent
    ? "bg-transparent border-transparent"
    : "bg-white/85 backdrop-blur border-gray-200 shadow-sm";

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${frameClass}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-1">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" aria-label="Roshara home">
            <Image
              src="/Roshara_logo.png"
              alt="Roshara"
              width={200}
              height={60}
              className="cursor-pointer"
              priority
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <ul className={`hidden md:flex space-x-8 items-center ${textClass}`}>
          {navLinks.map((link) => {
            const active = pathname === link.path;
            return (
              <li key={link.name} className="relative group">
                <Link
                  href={link.path}
                  className={`${hoverClass} ${active ? "underline underline-offset-8" : ""}`}
                >
                  {link.name}
                </Link>
                {/* dropdown placeholder */}
                {link.dropdown.length > 0 && (
                  <ul className="absolute left-0 top-full mt-2 bg-white text-black rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 min-w-[180px]">
                    {link.dropdown.map((item) => (
                      <li key={item.name} className="px-4 py-2 hover:bg-gray-100">
                        <Link href={item.path}>{item.name}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        {/* Icons + Auth (Desktop) */}
        <div className={`hidden md:flex items-center space-x-4 ${textClass}`}>
          <button aria-label="Wishlist" className={hoverClass}>
            <Heart />
          </button>

          <Link href="/cart" className={`relative flex items-center ${hoverClass}`}>
            <ShoppingBag />
            <span className="ml-2 text-sm">{cartCount}</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline">Hi, {user.name}</span>
              {user.role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  className={`px-3 py-1 border rounded ${isTransparent ? "border-white text-white" : "border-black text-black"}`}
                >
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className={`${isTransparent ? "bg-white text-black" : "bg-black text-white"} px-3 py-1 rounded`}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className={`flex items-center gap-2 ${hoverClass}`}>
                <User />
                <span className="hidden sm:inline">Login</span>
              </Link>
              <Link href="/auth/register" className={`text-sm ${hoverClass}`}>
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <svg className={`w-6 h-6 ${textClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-white text-black px-6 py-4 shadow">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.path} className="block font-medium">
                  {link.name}
                </Link>
              </li>
            ))}
            <li className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <Link href="/cart" className="flex items-center gap-2">
                  <ShoppingBag />
                  <span>Cart ({cartCount})</span>
                </Link>
                {user ? (
                  <div className="flex items-center gap-2">
                    <span>Hi, {user.name}</span>
                    {user.role === "admin" && (
                      <Link href="/admin/dashboard" className="px-2 py-1 border rounded">
                        Admin
                      </Link>
                    )}
                    <button onClick={logout} className="ml-2 px-2 py-1 bg-black text-white rounded">
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link href="/auth/login" className="flex items-center gap-2">
                      <User />
                      <span>Login</span>
                    </Link>
                    <Link href="/auth/register" className="text-sm underline">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
