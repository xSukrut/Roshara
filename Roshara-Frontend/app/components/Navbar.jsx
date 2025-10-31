"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Heart, ShoppingBag, User, ChevronDown } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { user, logout } = useAuth();
  const cartItems = useCart()?.items || [];
  const { items: wishlistItems } = useWishlist();

  const cartCount = cartItems.reduce((sum, it) => sum + (it.qty || 0), 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => setMenuOpen(false), [pathname]);

  /**
   * Desktop & Mobile navigation structure
   * Add About dropdown with two items:
   *  - About ROSHARA (/about)
   *  - Shipping & Return Policy (/about/shipping-returns)
   */
  const navLinks = [
    { name: "New Arrivals", path: "/new-arrivals" },
    { name: "Shop All", path: "/shop" },
    { name: "Collections", path: "/collections" },
    {
      name: "About",
      dropdown: [
        { name: "About ROSHARA", path: "/about" },
        { name: "Shipping & Return Policy", path: "/about/shipping-returns" },
      ],
    },
    { name: "Contact Us", path: "/contact" },
  ];

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
        <ul className={`hidden md:flex space-x-4 items-center ${textClass}`}>
          {navLinks.map((link) => {
            const active = pathname === link.path;

            // Dropdown item
            if (link.dropdown?.length) {
              return (
                <li key={link.name} className="relative group">
                  <button
                    className={`inline-flex items-center gap-1 ${hoverClass}`}
                    aria-haspopup="menu"
                    aria-expanded="false"
                  >
                    {link.name} <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Dropdown panel */}
                  <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-150 absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-md border bg-white text-black shadow-lg">
                    {link.dropdown.map((d) => (
                      <Link
                        key={d.name}
                        href={d.path}
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        {d.name}
                      </Link>
                    ))}
                  </div>
                </li>
              );
            }

            // Regular link
            return (
              <li key={link.name} className="relative group">
                <Link
                  href={link.path}
                  className={`${hoverClass} ${active ? "underline underline-offset-8" : ""}`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Icons + Auth (Desktop) */}
        <div className={`hidden md:flex items-center space-x-4 ${textClass}`}>
          {/* Wishlist → /wishlist */}
          <Link href="/wishlist" className={`relative flex items-center ${hoverClass}`} aria-label="Wishlist">
            <Heart />
            <span className="ml-2 text-sm">{wishlistCount}</span>
          </Link>

          {/* Cart → /cart */}
          <Link href="/cart" className={`relative flex items-center ${hoverClass}`} aria-label="Cart">
            <ShoppingBag />
            <span className="ml-2 text-sm">{cartCount}</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <UserMenu user={user} isTransparent={isTransparent} onLogout={logout} />

              {(user.role === "admin" || user.isAdmin) && (
                <Link
                  href="/admin"
                  className={`px-3 py-1 border rounded ${
                    isTransparent ? "border-white text-white" : "border-black text-black"
                  }`}
                  aria-label="Admin dashboard"
                >
                  Admin
                </Link>
              )}
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
            {navLinks.map((link) => {
              // Mobile dropdown for About
              if (link.dropdown?.length) {
                return <MobileDropdown key={link.name} label={link.name} items={link.dropdown} />;
              }
              return (
                <li key={link.name}>
                  <Link href={link.path} className="block font-medium">
                    {link.name}
                  </Link>
                </li>
              );
            })}

            {(user?.role === "admin" || user?.isAdmin) && (
              <li className="pt-2">
                <Link href="/admin" className="block font-semibold">
                  Admin Dashboard →
                </Link>
              </li>
            )}

            {user ? (
              <>
                <li className="pt-2">
                  <Link href="/account" className="block">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link href="/account/orders" className="block">
                    My Orders
                  </Link>
                </li>
                <li>
                  <button onClick={logout} className="block w-full text-left">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="pt-2">
                <Link href="/auth/login" className="block">
                  Login
                </Link>
              </li>
            )}

            <li className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <Link href="/wishlist" className="flex items-center gap-2">
                  <Heart />
                  <span>Wishlist ({wishlistCount})</span>
                </Link>
                <Link href="/cart" className="flex items-center gap-2">
                  <ShoppingBag />
                  <span>Cart ({cartCount})</span>
                </Link>
              </div>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

/** Desktop account dropdown */
function UserMenu({ user, isTransparent, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className={`flex items-center gap-1 ${isTransparent ? "text-white" : "text-black"}`}
        aria-haspopup="menu"
        aria-expanded={open ? "true" : "false"}
      >
        Hi, {user.name?.split(" ")[0] || "User"}
        <span className="inline-block translate-y-[1px]">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow text-sm z-50">
          <Link
            href="/account"
            className="block px-4 py-2 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            My Account
          </Link>
          <Link
            href="/account/orders"
            className="block px-4 py-2 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            My Orders
          </Link>

          {(user.role === "admin" || user.isAdmin) && (
            <Link
              href="/admin"
              className="block px-4 py-2 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              Admin
            </Link>
          )}

          <button
            onClick={() => {
              setOpen(false);
              onLogout?.();
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

/** Small collapsible for mobile About dropdown */
function MobileDropdown({ label, items }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="border rounded-md">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left font-medium px-3 py-2 flex items-center justify-between"
        aria-expanded={open ? "true" : "false"}
      >
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="pb-2">
          {items.map((it) => (
            <Link key={it.name} href={it.path} className="block pl-6 pr-3 py-2 text-sm hover:bg-gray-50">
              {it.name}
            </Link>
          ))}
        </div>
      )}
    </li>
  );
}
