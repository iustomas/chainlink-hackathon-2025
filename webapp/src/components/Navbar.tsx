"use client";

// react
import React, { useEffect, useState } from "react";

// next
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// icons
import { HiMenuAlt4, HiX } from "react-icons/hi";
import { FiCopy, FiCheck } from "react-icons/fi";

// wagmi
import { useAccount, useDisconnect } from "wagmi";

// reown
import { modal } from "../../context";

// utils
import { formatAddress } from "../../utils/format-address";

interface NavbarProps {
  forceHover?: boolean;
}

export default function Navbar({ forceHover = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

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

  useEffect(() => {
    // Simulate a small delay to show loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [isConnected]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDisconnect(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const shouldBeTransparent = isHomePage && !isScrolled && !forceHover;

  const closeDrawer = () => {
    setIsClosing(true);
    setTimeout(() => {
      setDrawerOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const handleConnect = () => {
    if (modal) {
      modal.open();
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
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
            {isLoading ? (
              <div
                className={`px-4 py-1.5 rounded-[10px] font-semibold ${
                  shouldBeTransparent ? "text-white" : "text-black"
                }`}
              >
                <span className="animate-pulse">Checking wallet...</span>
              </div>
            ) : isConnected ? (
              <div className="relative">
                <button
                  onClick={() => setShowDisconnect(!showDisconnect)}
                  className={`px-4 py-1.5 rounded-[10px] font-semibold border cursor-pointer ${
                    shouldBeTransparent
                      ? "text-white border-white hover:bg-white/10"
                      : "text-black border-black hover:bg-black/10"
                  } transition-colors duration-200`}
                >
                  {formatAddress(address as string)}
                </button>

                {showDisconnect && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200"
                  >
                    <div className="p-3 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600">
                          Wallet Address
                        </span>
                        <button
                          onClick={() => copyToClipboard(address as string)}
                          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                          title="Copy address"
                        >
                          {copied ? (
                            <FiCheck className="text-green-500 cursor-pointer" />
                          ) : (
                            <FiCopy className="text-gray-500 cursor-pointer" />
                          )}
                        </button>
                      </div>

                      <span className="text-sm text-gray-500 break-all">
                        {address}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        disconnect();
                        setShowDisconnect(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleConnect}
                className={`ml-2 px-4 py-1.5 rounded-[10px] font-semibold transition-all duration-200 cursor-pointer hover:scale-105 ${
                  forceHover
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black hover:text-white"
                }`}
                title="Connect your wallet to get started"
              >
                Connect
              </button>
            )}

            <Link href="/contact-sales">
              <button
                className={`ml-2 px-4 py-1.5 rounded-[10px] font-semibold transition-all duration-200 cursor-pointer hover:scale-105 ${
                  forceHover
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black hover:text-white"
                }`}
                title="Contact our sales team"
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
                  {isLoading ? (
                    <div
                      className={`px-4 py-1.5 rounded-[10px] font-semibold ${
                        shouldBeTransparent ? "text-white" : "text-black"
                      }`}
                    >
                      <span className="animate-pulse">Checking wallet...</span>
                    </div>
                  ) : isConnected ? (
                    <div className="relative">
                      <button
                        onClick={() => setShowDisconnect(!showDisconnect)}
                        className="w-full border border-black rounded-lg py-3 font-semibold text-base"
                      >
                        {formatAddress(address as string)}
                      </button>
                      {showDisconnect && (
                        <div
                          ref={dropdownRef}
                          className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-w-[90vw] mx-auto"
                        >
                          <div className="p-3 border-b border-gray-100">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-600">
                                Wallet Address
                              </span>
                              <button
                                onClick={() =>
                                  copyToClipboard(address as string)
                                }
                                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                                title="Copy address"
                              >
                                {copied ? (
                                  <FiCheck className="text-green-500 cursor-pointer" />
                                ) : (
                                  <FiCopy className="text-gray-500 cursor-pointer" />
                                )}
                              </button>
                            </div>
                            <span className="text-sm text-gray-500 break-all">
                              {address}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              disconnect();
                              setShowDisconnect(false);
                              closeDrawer();
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                          >
                            Disconnect
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleConnect();
                        closeDrawer();
                      }}
                      className="w-full border border-black rounded-lg py-3 font-semibold text-base hover:bg-white hover:text-black transition-colors duration-200"
                    >
                      Connect
                    </button>
                  )}

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
