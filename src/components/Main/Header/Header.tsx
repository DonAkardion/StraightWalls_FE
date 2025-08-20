"use client";
import { useUser } from "@/context/UserContextProvider";
import { HeaderSearch } from "@/components/Main/Header/HeaderSearch";
import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import { Bell, Logo, Person, Menu, Close } from "../../../../public/icons";
import { useRouter } from "next/navigation";

export const Header = () => {
  const { user, isLoading, logout } = useUser();
  const [open, setOpen] = useState(false);

  if (isLoading || !user) return null;
  const role = user.role;

  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    if (open) {
      body.classList.add("overflow-hidden", "h-full");
      html.classList.add("overflow-hidden", "h-full");
    } else {
      body.classList.remove("overflow-hidden", "h-full");
      html.classList.remove("overflow-hidden", "h-full");
    }

    return () => {
      body.classList.remove("overflow-hidden", "h-full");
      html.classList.remove("overflow-hidden", "h-full");
    };
  }, [open]);

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  return (
    <header className={`${styles.header} flex-col z-[50] relative`}>
      <div
        className={`${styles.headerContainer} lg:pt-3 lg:pb-3 lg:pr-[60px] lg:pl-[60px] md:pr-[30px] md:pl-[30px] pt-[6px] pb-[10px] pl-[20px] pr-[20px] flex gap-[30px] justify-between items-center`}
      >
        <img
          className={`${styles.headerContainerImg} hover:cursor-pointer md:h-[60px] h-[34px]`}
          src={Logo.src}
          alt="Logo"
          onClick={() => router.push("/")}
        />
        <button
          className={`${styles.headerMobileMenuBtn} md:hidden flex`}
          onClick={toggleMenu}
          aria-expanded={open}
          aria-controls="mobileMenu"
        >
          <img
            src={open ? Close.src : Menu.src}
            alt="menu icon"
            className={
              open
                ? styles.headerMobileMenuIconClose
                : styles.headerMobileMenuIcon
            }
          />
        </button>

        <div
          className={`${styles.headerContainerSearch} hidden md:flex md:flex-grow max-w-[484px] min-w-[180px] w-[30%]`}
        >
          <div
            className={`${styles.headerContainerSearch} hidden md:flex md:flex-grow w-[30%]`}
          >
            <HeaderSearch role={role} />
          </div>
        </div>
        <nav
          className={`${styles.headerContainerLinks} hidden md:flex gap-[30px] w-[430px] items-center`}
        >
          <Link
            href={`/${role}/addProject`}
            className={styles.navigation}
            prefetch={false}
          >
            <div
              className={`${styles.navigationAddProjectBtn} flex max-w-[204px] min-w-[180px] items-center justify-center rounded-[5px] h-[52px] pl-[30px] pr-[30px] pt-[8px] pb-[8px]`}
            >
              Додати проєкт
            </div>
          </Link>
          <Link
            href={`/${role}/notifications`}
            className={`${styles.headerLink} relative shrink-0`}
            prefetch={false}
          >
            <img
              src={Bell.src}
              alt="Notifications"
              className={`${styles.personalNotifyImg}  w-[31px] h-[31px] `}
            />
            <div
              className={`${styles.personalNotifyMark} rounded-full top-[-2px] right-[1px] w-[11px] h-[11px] absolute`}
            ></div>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className={`${styles.navigationUser} flex shrink-0 items-center gap-[15px]`}
          >
            <img
              className={`${styles.navigationUserIcon} w-[42px] h-[42px]`}
              src={Person.src}
              alt="Search"
            />

            <div
              className={`${styles.navigationUserName} w-full max-w-[100px] `}
            >
              <span className=" ">{user.full_name}</span>
            </div>
          </button>
        </nav>
      </div>

      <div
        id="mobileMenu"
        className={`${styles.headerMobileMenu} ${
          open ? styles.headerMobileMenuOpen : ""
        } absolute top-0 left-0 z-[-1] w-full bg-white md:hidden`}
      >
        <div
          className={`${styles.headerMobileMenuWrapper} flex flex-col gap-[28px] h-screen justify-center items-center`}
        >
          <button
            type="button"
            onClick={handleLogout}
            className={`${styles.mobileMenuUser} flex flex-col mb-[44px] shrink-0 items-center gap-[15px]`}
          >
            <img
              className={`${styles.mobileMenuUserIcon} w-[68px] h-[74px]`}
              src={Person.src}
              alt="User"
            />
            <div className={`${styles.mobileMenuUserName} w-full `}>
              <span>{user.full_name}</span>
            </div>
          </button>
          <Link
            href={`/${role}/notifications`}
            onClick={closeMenu}
            className={`${styles.mobileMenuLink} relative shrink-0`}
            prefetch={false}
          >
            <div
              className={`${styles.mobileMenuAddProjectBtn} flex max-w-[450px] min-w-[351px] items-center gap-[10px] justify-center rounded-[5px] h-[52px] pl-[30px] pr-[30px] pt-[8px] pb-[8px]`}
            >
              <img
                src={Bell.src}
                alt="Notifications"
                className={`${styles.mobileMenuImg}  w-[31px] h-[31px] `}
              />
              Сповіщення
            </div>
          </Link>
          <Link
            href={`/${role}/addProject`}
            onClick={closeMenu}
            className={styles.mobileMenuNavigation}
            prefetch={false}
          >
            <div
              className={`${styles.mobileMenuAddProjectBtn} flex max-w-[450px] min-w-[351px] items-center justify-center rounded-[5px] h-[52px] pl-[30px] pr-[30px] pt-[8px] pb-[8px]`}
            >
              Додати проєкт
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
