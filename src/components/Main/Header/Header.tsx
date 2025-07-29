import React from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import { Bell, Logo, Search, Person } from "../../../../public/icons";

export const Header = () => {
  return (
    <header className={`${styles.header} z-[100] relative`}>
      <div
        className={`${styles.headerContainer}  pt-3 pb-3 pl-[60px] pr-[60px] flex justify-between items-center`}
      >
        <img
          className={`${styles.headerContainerImg} h-[60px]`}
          src={Logo.src}
          alt="Logo"
        />
        <div className={`${styles.headerContainerSearch} `}>
          <div
            className={`${styles.search} pl-[30px] pr-[8px] flex items-center border-1 rounded-[5px]`}
          >
            <input
              type="text"
              placeholder="Пошук"
              className={`${styles.searchInput} w-[484px] h-[50px]`}
            ></input>
            <img
              className={`${styles.searchImg} w-[36px] h-[36px]`}
              src={Search.src}
              alt="Search"
            />
          </div>
        </div>
        <nav
          className={`${styles.headerContainerLinks} flex gap-[30px] items-center`}
        >
          <Link
            href="/addProject"
            className={styles.Navigation}
            prefetch={false}
          >
            <div
              className={`${styles.NavigationAddProjectBtn} flex items-center rounded-[5px] h-[52px] pl-[30px] pr-[30px] pt-[8px] pb-[8px]`}
            >
              Додати проєкт
            </div>
          </Link>
          <Link
            href="/notifications"
            className={`${styles.headerLink}relative`}
            prefetch={false}
          >
            <img
              src={Bell.src}
              alt="Notifications"
              className={`${styles.PersonalNotifyImg} w-[31px] h-[31px] `}
            />
            <div
              className={`${styles.PersonalNotifyMark} rounded-full top-[24px] right-[213px] w-[11px] h-[11px] absolute`}
            ></div>
          </Link>
          <Link
            href="/cabinet"
            className={`${styles.NavigationUser} flex items-center gap-[15px]`}
            prefetch={false}
          >
            <img
              className={`${styles.NavigationUserIcon} w-[42px] h-[42px]`}
              src={Person.src}
              alt="Search"
            />
            <div className={`${styles.NavigationUserName} `}>Олексій</div>
          </Link>
        </nav>
      </div>
    </header>
  );
};
