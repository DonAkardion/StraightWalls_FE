import React from "react";
import styles from "./NavigationButton.module.css";
import { ArrowRight } from "../../../public/icons";

interface INavigationButton {
  onClick: () => void;
  isOpen?: boolean;
  isScrolling?: boolean;
}

export const NavigationButton: React.FC<INavigationButton> = ({
  onClick,
  isOpen = false,
  isScrolling = false,
}) => (
  <div className="">
    <button
      onClick={onClick}
      style={{
        boxShadow: "-1px 4px 14px 1px rgba(255, 230, 230, 0.7)",
      }}
      className={`
      cursor-pointer
      z-60
      ${
        isScrolling ? "transition-none" : "transition-all duration-500 ease-out"
      }
      flex items-center justify-center
      select-none
      touch-manipulation
    `}
      aria-label={isOpen ? "Закрити Сайдбар" : "Відкрити Сайдбар"}
    >
      <div
        className={`${styles.button} flex items-center rounded-[5px] justify-center w-[30px] h-[40px] `}
      >
        <img
          src={ArrowRight.src}
          alt="menu icon"
          className={`w-[8px] h-[12px] transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
    </button>
  </div>
);
