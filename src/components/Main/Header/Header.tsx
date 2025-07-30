"use client";
import React, { useState } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import {
  Bell,
  Logo,
  Search,
  Person,
  Menu,
  Close,
} from "../../../../public/icons";

export const Header = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);
  return (
    <header className={`${styles.header} flex-col z-[100] relative`}>
      <div
        className={`${styles.headerContainer} lg:pt-3 lg:pb-3 lg:pr-[60px] lg:pl-[60px] md:pr-[30px] md:pl-[30px] pt-[6px] pb-[10px] pl-[20px] pr-[20px] flex gap-[30px] justify-between items-center`}
      >
        <img
          className={`${styles.headerContainerImg}  md:h-[60px] h-[34px]`}
          src={Logo.src}
          alt="Logo"
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
            className={`${styles.search} pl-[30px] pr-[8px] w-full flex items-center border-1 rounded-[5px]`}
          >
            <input
              type="text"
              placeholder="Пошук"
              className={`${styles.searchInput} w-full h-[50px]`}
            ></input>
            <img
              className={`${styles.searchImg} w-[36px] h-[36px]`}
              src={Search.src}
              alt="Search"
            />
          </div>
        </div>
        <nav
          className={`${styles.headerContainerLinks} hidden md:flex gap-[30px] w-[430px] items-center`}
        >
          <Link
            href="/addProject"
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
            href="/notifications"
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
          <Link
            href="/cabinet"
            className={`${styles.navigationUser} flex shrink-0 items-center gap-[15px]`}
            prefetch={false}
          >
            <img
              className={`${styles.navigationUserIcon} w-[42px] h-[42px]`}
              src={Person.src}
              alt="Search"
            />
            <div className={`${styles.navigationUserName} w-full `}>
              Олексій
            </div>
          </Link>
        </nav>
      </div>
      {open && (
        <div id="mobileMenu" className={styles.headerMobileMenu}>
          <div
            className={`${styles.headerMobileMenuWrapper} flex flex-col gap-[28px] justify-center items-center`}
          >
            <Link
              href="/cabinet"
              onClick={closeMenu}
              className={`${styles.mobileMenuUser} flex flex-col mb-[44px] shrink-0 items-center gap-[15px]`}
              prefetch={false}
            >
              <img
                className={`${styles.mobileMenuUserIcon} w-[68px] h-[74px]`}
                src={Person.src}
                alt="Search"
              />
              <div className={`${styles.mobileMenuUserName} w-full `}>
                Олексій
              </div>
            </Link>
            <Link
              href="/notifications"
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
              href="/addProject"
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
      )}
    </header>
  );
};
