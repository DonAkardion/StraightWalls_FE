"use client";
import { useUser } from "@/hooks/useUser";
import React, { useState, useEffect } from "react";
import { NavigationButton } from "@/components/Navigation/NavigationButton";
import { NavigationMenu } from "@/components/Navigation/NavigationMenu";
import { NavigationMessage } from "@/components/Navigation/NavigationMessage/NavigationMessage";

export default function NavigationModul({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUser();
  const [open, setOpen] = useState(false);
  const [isScrolling] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <div className="relative flex lg:flex-row-reverse h-full w-full">
      {/* Desktop Sidebar */}

      <aside
        className="hidden lg:block absolute top-0 left-0 bottom-0 w-[311px] min-h-[1000px] bg-white z-[40]"
        style={{ boxShadow: "1px 3px 15px 2px rgba(0, 0, 0, 0.25)" }}
      >
        <NavigationMenu role={user.role} isOpen onClose={() => {}} />
        <NavigationMessage />
      </aside>

      {/* Mobile Sidebar */}

      {open && (
        <aside
          className="fixed top-0 w-[246px] z-[40] bg-white lg:hidden transform transition-transform duration-300 ease-in-out translate-x-0"
          style={{
            height: "100vh",
            overflow: "hidden",
            boxShadow: "1px 3px 15px 2px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="">
            <NavigationMenu
              role={user.role}
              isOpen={true}
              onClose={() => setOpen(false)}
            />
          </div>
        </aside>
      )}

      {/* Toggle Button */}

      <div
        className=" z-[35] lg:hidden fixed transition-all duration-300"
        style={{
          left: open ? "242px" : "-4px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <NavigationButton
          onClick={() => setOpen((prev) => !prev)}
          isOpen={open}
          isScrolling={isScrolling}
        />
      </div>
      {/* Main Content */}

      <main
        id="main-content"
        className=" transition-all duration-300 ease-in-out w-full  lg:w-[calc(100%-311px)] min-h-screen"
      >
        {children}
      </main>
    </div>
  );
}
