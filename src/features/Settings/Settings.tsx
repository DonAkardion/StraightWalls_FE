"use client";
import React from "react";
import { useParams } from "next/navigation";
import styles from "./Settings.module.css";
import Link from "next/link";

export function Settings() {
  const params = useParams();
  const role = params.role as string;

  return (
    <section
      className={`${styles.settings} max-w-[1126px] m-auto pt-[50px] pl-[20px] pr-[20px] lg:pt-[130px] lg:pl-[76px] lg:pr-[58px] md:pt-[58px] md:pl-[60px] md:pr-[40px]`}
    >
      {role === "admin" ? (
        <nav
          className={`${styles.settingsLinksList} grid grid-cols-1 justify-items-center md:grid-cols-2 gap-x-[40px] gap-y-[40px] md:gap-y-[30px]`}
        >
          <Link
            href="/"
            className={`${styles.settingsLinksListLink} 
          `}
            prefetch={false}
          >
            <div>Управління користувачами</div>
          </Link>
          <Link
            href="/"
            className={`${styles.settingsLinksListLink} 
          `}
            prefetch={false}
          >
            <div>Управління даними</div>
          </Link>
          <Link
            href="/"
            className={`${styles.settingsLinksListLink} 
          `}
            prefetch={false}
          >
            <div>Системні налаштування</div>
          </Link>
          <Link
            href="/"
            className={`${styles.settingsLinksListLink} 
          `}
            prefetch={false}
          >
            <div>Журнал аудиту/логів</div>
          </Link>
          <Link
            href={`/${role}/settings/serviceSettings`}
            className={`${styles.settingsLinksListLink} 
          `}
            prefetch={false}
          >
            <div>Налаштування послуг</div>
          </Link>
          <Link
            href="/"
            className={`${styles.settingsLinksListLink} 
          `}
            prefetch={false}
          >
            <div>Налаштування відсотку зарплати</div>
          </Link>
        </nav>
      ) : (
        <nav
          className={`${styles.headerContainerLinks} grid grid-cols-1 justify-items-center md:grid-cols-2 gap-x-[40px] gap-y-[40px] md:gap-y-[30px]`}
        >
          <Link
            href="/"
            className={`${styles.settingsLinksListLink} 
          `}
            prefetch={false}
          >
            <div>Системні налаштування</div>
          </Link>
          <Link
            href="/"
            className={`${styles.settingsLinksListLink} 
          `}
            prefetch={false}
          >
            <div>
              Журнал аудиту<span>/</span>логів
            </div>
          </Link>
        </nav>
      )}
    </section>
  );
}
