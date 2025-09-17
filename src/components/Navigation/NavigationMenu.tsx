"use client";

import React, { useEffect, useRef } from "react";
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

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ role, onClose, isOpen }) => {
  const pathname = usePathname();
  const navigationMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (navigationMenuRef.current && !navigationMenuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

   if (!isOpen) return null;

  return (
    <div ref={navigationMenuRef} className={`${styles.navigationMenu} `} style={{}}>
      {role === "admin" || role === "accountant" ? (
        <nav
          className={`${styles.navigationMenuList} flex-col mt-[102px] lg:mt-[52px]`}
        >
          <Link
            href="/"
            className={`${styles.navigationMenuListLink} 
          ${
            [`/${role}`, `/${role}/notifications`].includes(pathname)
              ? styles.activeLink
              : ""
          } 
        
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
            href={`/${role}/projects`}
            className={`${styles.navigationMenuListLink} 
            ${
              pathname.startsWith(`/${role}/projects`) ||
              pathname.startsWith(`/${role}/addProject`)
                ? styles.activeLink
                : ""
            }
          `}
            prefetch={false}
          >
            <img
              className={`${styles.menuLinkImg} `}
              src={Papers.src}
              alt="Projects"
            />
            <div>Проєкти</div>
          </Link>
          <Link
            href={`/${role}/clients`}
            className={`${styles.navigationMenuListLink}
          ${pathname.startsWith(`/${role}/clients`) ? styles.activeLink : ""}
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
            href={`/${role}/workers`}
            className={`${styles.navigationMenuListLink}
          ${pathname.startsWith(`/${role}/workers`) ? styles.activeLink : ""}
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
            href={`/${role}/reports`}
            className={`${styles.navigationMenuListLink}
          ${pathname === `/${role}/reports` ? styles.activeLink : ""}
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
            href={`/${role}/settings`}
            className={`${styles.navigationMenuListLink}
          
          ${pathname.startsWith(`/${role}/settings`) ? styles.activeLink : ""}
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
          ${
            [`/${role}`, `/${role}/notifications`].includes(pathname)
              ? styles.activeLink
              : ""
          } 
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
            href={`/${role}/projects`}
            className={`${styles.navigationMenuListLink}
          ${
            pathname.startsWith(`/${role}/projects`) ||
            pathname.startsWith(`/${role}/addProject`)
              ? styles.activeLink
              : ""
          }
          `}
            prefetch={false}
          >
            <img
              className={`${styles.menuLinkImg} `}
              src={Papers.src}
              alt="Projects"
            />
            <div>Проєкти</div>
          </Link>
          <Link
            href={`/${role}/clients`}
            className={`${styles.navigationMenuListLink}
          ${pathname.startsWith(`/${role}/clients`) ? styles.activeLink : ""}
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
            href={`/${role}/settings`}
            className={`${styles.navigationMenuListLink}
          ${pathname.startsWith(`/${role}/settings`) ? styles.activeLink : ""}
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
