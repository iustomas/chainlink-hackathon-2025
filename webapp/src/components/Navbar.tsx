"use client";

// react
import React, { useEffect, useState } from "react";

// next
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// icons
import { HiMenuAlt4, HiX } from "react-icons/hi";

interface NavbarProps {
  forceHover?: boolean;
}

export default function Navbar({ forceHover = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [drawerOpen]);

  const shouldBeTransparent = isHomePage && !isScrolled && !forceHover;

  const closeDrawer = () => {
    setIsClosing(true);
    setTimeout(() => {
      setDrawerOpen(false);
      setIsClosing(false);
    }, 300);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 border-b border-white/30 ${
        shouldBeTransparent ? "bg-transparent" : "bg-white"
      }`}
    >
      <div className="w-[95%] mx-auto">
        {/* Navbar Desktop */}
        <div className="hidden md:flex items-center justify-between h-16">
          {/* Logo and menu */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/">
              <Image
                src={
                  shouldBeTransparent
                    ? "/assets/logo/logo-white.svg"
                    : "/assets/logo/logo-black.svg"
                }
                alt="Tomas"
                width={80}
                height={80}
                className="w-20 h-20"
              />
            </Link>

            {/* Divider */}
            <div
              className={`h-8 w-[1px] ${
                shouldBeTransparent ? "bg-white" : "bg-gray-400"
              }`}
            />

            {/* Main menu */}
            <ul
              className={`flex gap-6 font-medium text-base transition-colors duration-300 ${
                shouldBeTransparent ? "text-white" : "text-black"
              }`}
            >
              <Link href="/">
                <li className="cursor-pointer hover:opacity-70 transition-opacity duration-200 font-bold">
                  Home
                </li>
              </Link>
            </ul>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-4 pr-2">
            <Link href="/contact-sales">
              <button
                className={`ml-2 px-4 py-1.5 rounded-[10px] font-semibold transition-colors duration-200 cursor-pointer ${
                  forceHover
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black hover:text-white"
                }`}
              >
                Contact
              </button>
            </Link>
          </div>
        </div>

        {/* Navbar Mobile */}
        <div className="flex md:hidden items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/assets/logo/logo-black.svg"
              alt="Tomas"
              width={80}
              height={80}
              className="w-20 h-20"
            />
          </Link>

          <button
            className="p-2 focus:outline-none"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            {drawerOpen ? <HiX size={28} /> : <HiMenuAlt4 size={28} />}
          </button>
        </div>

        {/* Drawer Mobile */}
        {(drawerOpen || isClosing) && (
          <div
            className={`fixed inset-0 z-50 bg-black/60 flex flex-col ${
              isClosing ? "animate-fade-out" : "animate-fade-in"
            }`}
            onClick={closeDrawer}
          >
            <div
              className={`bg-white w-full max-w-full h-[calc(100%-4rem)] mt-16 shadow-lg ${
                isClosing ? "animate-slide-up" : "animate-slide-down"
              } p-6 pt-4 flex flex-col gap-2 relative`}
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex flex-col gap-2 mt-2">
                <Link href="/" onClick={closeDrawer}>
                  <span className="block font-bold text-lg py-2">Home</span>
                </Link>
              </nav>

              {/* Mobile Drawer Buttons */}
              <div className="mt-auto pt-4 border-t border-gray-200">
                <div className="flex flex-col gap-2">
                  <button className="w-full border border-black rounded-lg py-3 font-semibold text-base">
                    View demo
                  </button>

                  <button className="w-full bg-black text-white rounded-lg py-3 font-semibold text-base">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes slide-down {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slide-up {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-100%);
            opacity: 0;
          }
        }
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes fade-out {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-fade-in {
          animation: fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-fade-out {
          animation: fade-out 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </nav>
  );
}
