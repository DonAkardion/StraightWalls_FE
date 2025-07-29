"use client";
import styles from "./Navigation.module.css";
import React, { useState, useEffect } from "react";
import { NavigationButton } from "@/components/Navigation/NavigationButton";
import { NavigationMenu } from "@/components/Navigation/NavigationMenu";

export default function NavigationModul({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({
    bottom: "20%",
  });

  const lockScroll = () => {
    const scrollY = window.scrollY;
    document.body.style.cssText = `
      overflow: hidden;
      position: fixed;
      top: -${scrollY}px;
      width: 100%;
    `;
  };
  const unlockScroll = () => {
    const scrollY = parseInt(document.body.style.top || "0") * -1;
    document.body.style.cssText = "";
    if (scrollY) window.scrollTo(0, scrollY);
  };

  useEffect(() => {
    if (open) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return () => unlockScroll();
  }, [open]);

  return (
    <div className="relative flex h-full w-full">
      <div className="fixed left-4 z-[60] lg:hidden">
        <NavigationButton
          onClick={() => setOpen(true)}
          dynamicPosition={{ bottom: buttonPosition.bottom }}
          isScrolling={isScrolling}
        />
      </div>
      <aside
        className="hidden lg:block absolute top-0 left-0 bottom-0 w-[311px] bg-white z-40"
        style={{ boxShadow: "1px 3px 15px 2px rgba(0, 0, 0, 0.25)" }}
      >
        <NavigationMenu isOpen onClose={() => {}} />
      </aside>
      {open && (
        <aside
          className="fixed inset-0 z-[100] bg-white lg:hidden transform transition-transform duration-300 ease-in-out translate-x-0"
          style={{ height: "100vh", overflow: "hidden" }}
        >
          <div className="h-full overflow-y-auto">
            <NavigationMenu isOpen={true} onClose={() => setOpen(false)} />
          </div>
        </aside>
      )}
      <main
        id="main-content"
        className="transition-all duration-300 ease-in-out w-full sm:w-[calc(100%-42px)] lg:w-[calc(100%-311px)] min-h-screen"
      >
        {children}
      </main>
    </div>
  );
}
