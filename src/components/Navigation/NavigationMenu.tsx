"use client";

import { useUser } from "@/hooks/useUser";
import React from "react";
import styles from "./NavigationMenu.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Papers,
  People,
  Worker,
  Paper,
  Cog,
} from "../../../public/icons";

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  role: string;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  isOpen,
  onClose,
  role,
}) => {
  const pathname = usePathname();
  const user = useUser();
  return (
    <div className={`${styles.navigationMenu} `} style={{ height: "100%" }}>
      {role === "admin" ? (
        <nav
          className={`${styles.navigationMenuList} flex-col mt-[102px] lg:mt-[52px]`}
        >
          <Link
            href="/"
            className={`${styles.navigationMenuListLink} 
          ${pathname === "/" ? styles.activeLink : ""} 
          `}
            prefetch={false}
          >
            <img
              className={`${styles.menuLinkImg} `}
              src={Home.src}
              alt="Home"
            />
            <div>Головна</div>
          </Link>
          <Link
            href="/Projects"
            className={`${styles.navigationMenuListLink}
          ${pathname === "/Projects" ? styles.activeLink : ""}
          `}
            prefetch={false}
          >
            <img
              className={`${styles.menuLinkImg} `}
              src={Papers.src}
              alt="Projects"
            />
            <div>Проэкти</div>
          </Link>
          <Link
            href="/Clients"
            className={`${styles.navigationMenuListLink}
          ${pathname === "/Clients" ? styles.activeLink : ""}
          `}
            prefetch={false}
          >
            <img
              className={`${styles.menuLinkImg} `}
              src={People.src}
              alt="Clients"
            />
            <div>Клієнти</div>
          </Link>
          <Link
            href="/Employees"
            className={`${styles.navigationMenuListLink}
          ${pathname === "/Employees" ? styles.activeLink : ""}
          `}
            prefetch={false}
          >
            <img
              className={`${styles.menuLinkImg} `}
              src={Worker.src}
              alt="Employees"
            />
            <div>Робітники</div>
          </Link>
          <Link
            href="/Reports"
            className={`${styles.navigationMenuListLink}
          ${pathname === "/Reports" ? styles.activeLink : ""}
          `}
            prefetch={false}
          >
            <img
              className={`${styles.menuLinkImg} `}
              src={Paper.src}
              alt="Reports"
            />
            <div>Звіти</div>
          </Link>
          <Link
            href="/Settings"
            className={`${styles.navigationMenuListLink}
          ${pathname === "/Settings" ? styles.activeLink : ""}
          `}
            prefetch={false}
          >
            <img
              className={`${styles.menuLinkImg} `}
              src={Cog.src}
              alt="Settings"
            />
            <div>Налаштування</div>
          </Link>
        </nav>
      ) : (
        <nav
          className={`${styles.navigationMenuList} flex-col mt-[102px] lg:mt-[52px]`}
        >
          <Link
            href="/"
            className={`${styles.navigationMenuListLink} 
          ${pathname === "/" ? styles.activeLink : ""} 
          `}
            prefetch={false}
          >
            <img
              className={`${styles.menuLinkImg} `}
              src={Home.src}
              alt="Home"
            />
            <div>Головна</div>
          </Link>
          <Link
            href="/Projects"
            className={`${styles.navigationMenuListLink}
          ${pathname === "/Projects" ? styles.activeLink : ""}
          `}
            prefetch={false}
          >
            <img
              className={`${styles.menuLinkImg} `}
              src={Papers.src}
              alt="Projects"
            />
            <div>Проэкти</div>
          </Link>
          <Link
            href="/Clients"
            className={`${styles.navigationMenuListLink}
          ${pathname === "/Clients" ? styles.activeLink : ""}
          `}
            prefetch={false}
          >
            <img
              className={`${styles.menuLinkImg} `}
              src={People.src}
              alt="Clients"
            />
            <div>Клієнти</div>
          </Link>
          <Link
            href="/Settings"
            className={`${styles.navigationMenuListLink}
          ${pathname === "/Settings" ? styles.activeLink : ""}
          `}
            prefetch={false}
          >
            <img
              className={`${styles.menuLinkImg} `}
              src={Cog.src}
              alt="Settings"
            />
            <div>Налаштування</div>
          </Link>
        </nav>
      )}
    </div>
  );
};
