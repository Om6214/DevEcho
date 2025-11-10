"use client";

import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useEffect, useState } from "react";
import { ModeToggle } from "./toggle";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import Link from 'next/link'


export function NavbarDemo() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    // NOTE: We still read token from redux, but only use it after mount
    const { token } = useAppSelector((state) => state.auth);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // mark mounted on client only
        setMounted(true);
    }, []);

    const navItems = [
        { name: "Blogs", link: "/" },
        { name: "Explore", link: "/explore" },
        { name: "Create", link: "/create" },
        { name: "Profile", link: "/profile" },
    ];

    const handleLogout = () => {
        dispatch(logout());
        router.push("/auth/login");
    };

    return (
        <div className="relative mb-14 w-full">
            <Navbar>
                {/* Desktop Navigation */}
                <NavBody>
                    <NavbarLogo />
                    <NavItems items={navItems} />
                    <div className="flex items-center gap-4 relative z-50">
                        <ModeToggle />

                        {/*
              IMPORTANT:
              - Until mounted === true we render the server-safe version (Login / Sign Up)
              - After mount, if token exists we show Logout, otherwise Login/Sign Up.
              This prevents hydration mismatch because server and initial client render match.
            */}
                        {!mounted ? (
                            <span className="opacity-0">Login</span> // keeps layout stable
                        ) : token ? (
                            <NavbarButton onClick={handleLogout} variant="secondary">
                                Logout
                            </NavbarButton>
                        ) : (
                            <>
                                <NavbarButton href="/auth/login" variant="secondary">Login</NavbarButton>
                                <NavbarButton href="/auth/signup" variant="primary">Sign Up</NavbarButton>
                            </>
                        )}

                    </div>
                </NavBody>

                {/* Mobile Navigation */}
                <MobileNav>
                    <MobileNavHeader>
                        <NavbarLogo />
                        <div className="flex items-center gap-2">
                            <ModeToggle />
                            <MobileNavToggle
                                isOpen={isMobileMenuOpen}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            />
                        </div>
                    </MobileNavHeader>

                    <MobileNavMenu
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                    >
                        {navItems.map((item, idx) => (
                            <Link
                                key={`mobile-link-${idx}`}
                                href={item.link}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="relative text-neutral-600 dark:text-neutral-300 py-2 block"
                            >
                                {item.name}
                            </Link>
                        ))}


                        <div className="flex w-full flex-col gap-4 mt-4">
                            {!mounted ? (
                                <>
                                    <NavbarButton
                                        href="/auth/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        variant="secondary"
                                        className="w-full"
                                    >
                                        Login
                                    </NavbarButton>
                                    <NavbarButton
                                        href="/auth/signup"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        variant="primary"
                                        className="w-full"
                                    >
                                        Sign Up
                                    </NavbarButton>
                                </>
                            ) : !token ? (
                                <>
                                    <NavbarButton
                                        href="/auth/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        variant="secondary"
                                        className="w-full"
                                    >
                                        Login
                                    </NavbarButton>
                                    <NavbarButton
                                        href="/auth/signup"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        variant="primary"
                                        className="w-full"
                                    >
                                        Sign Up
                                    </NavbarButton>
                                </>
                            ) : (
                                <NavbarButton
                                    onClick={() => {
                                        handleLogout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    variant="secondary"
                                    className="w-full"
                                >
                                    Logout
                                </NavbarButton>
                            )}
                        </div>
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>
        </div>
    );
}
