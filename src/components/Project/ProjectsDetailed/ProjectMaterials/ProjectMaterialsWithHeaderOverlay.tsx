"use client";
import React, { useEffect, useRef, useState, ReactNode } from "react";
import styles from "./ProjectMaterialsTableWrapper.module.css";

interface ProjectMaterialsWithHeaderOverlayProps {
  children: ReactNode;
  disableOverlay?: boolean;
  className?: string;
  scrollSelector?: string;
}

export const ProjectMaterialsWithHeaderOverlay: React.FC<
  ProjectMaterialsWithHeaderOverlayProps
> = ({
  children,
  disableOverlay = false,
  className = "",
  scrollSelector = "",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headerSentinelRef = useRef<HTMLDivElement | null>(null);
  const footerSentinelRef = useRef<HTMLDivElement | null>(null);
  const overlayContentRef = useRef<HTMLDivElement | null>(null);

  const [headerVisible, setHeaderVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(false);
  const [containerInView, setContainerInView] = useState(false);
  const [overlayStyle, setOverlayStyle] = useState<React.CSSProperties>({});
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    const updateOverlayPosition = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setOverlayStyle({
          left: rect.left,
          width: rect.width,
        });
      }
    };

    updateOverlayPosition();
    window.addEventListener("scroll", updateOverlayPosition);
    window.addEventListener("resize", updateOverlayPosition);

    return () => {
      window.removeEventListener("scroll", updateOverlayPosition);
      window.removeEventListener("resize", updateOverlayPosition);
    };
  }, []);

  useEffect(() => {
    const header = headerSentinelRef.current;
    const footer = footerSentinelRef.current;
    const container = containerRef.current;
    if (!header || !footer || !container) return;

    const headerObserver = new IntersectionObserver(
      ([entry]) => setHeaderVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    const footerObserver = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    const containerObserver = new IntersectionObserver(
      ([entry]) => setContainerInView(entry.isIntersecting),
      { threshold: 0 }
    );

    headerObserver.observe(header);
    footerObserver.observe(footer);
    containerObserver.observe(container);

    return () => {
      headerObserver.disconnect();
      footerObserver.disconnect();
      containerObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    let scrollContainer: HTMLElement | null = null;
    if (scrollSelector) {
      scrollContainer = document.querySelector(scrollSelector);
    } else if (containerRef.current) {
      scrollContainer =
        containerRef.current.querySelector("table")?.parentElement || null;
    }

    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollLeft = scrollContainer!.scrollLeft;
      scrollLeftRef.current = scrollLeft;
      if (overlayContentRef.current) {
        overlayContentRef.current.style.transform = `translateX(-${scrollLeft}px)`;
      }
    };

    // слухаємо навіть коли overlay неактивна — щоб зберігати останній scrollLeft
    scrollContainer.addEventListener("scroll", handleScroll);

    // одразу виставляємо позицію при монтуванні
    const initialLeft = scrollContainer.scrollLeft;
    scrollLeftRef.current = initialLeft;
    if (overlayContentRef.current) {
      overlayContentRef.current.style.transform = `translateX(-${initialLeft}px)`;
    }

    return () => {
      scrollContainer?.removeEventListener("scroll", handleScroll);
    };
  }, [scrollSelector]);

  const showOverlay =
    !disableOverlay && !headerVisible && containerInView && !footerVisible;

  useEffect(() => {
    if (showOverlay && overlayContentRef.current) {
      const scrollLeft = scrollLeftRef.current;
      overlayContentRef.current.style.transform = `translateX(-${scrollLeft}px)`;
    }
  }, [showOverlay]);

  return (
    <div ref={containerRef} className={`relative hidden md:block ${className}`}>
      {/* оригінальний хедер таблиці */}
      <div className="absolute top-[5%]" ref={headerSentinelRef}></div>

      {/* сама таблиця */}
      {children}
      <div className="absolute bottom-[-40%]" ref={footerSentinelRef}></div>
      {/* плашка, яка з’являється при скролі */}
      {showOverlay && (
        <div
          className={`${styles.header} fixed w-full top-1 h-[76px] border-gray-300 z-50 rounded-[5px] overflow-hidden`}
          style={{
            ...overlayStyle,
            right: "auto",
          }}
        >
          <div
            ref={overlayContentRef}
            className={`${styles.headerContainer} pl-[50px] pr-[70px] flex w-fit py-[24px] transition-transform duration-75 ease-linear truncate`}
          >
            <div className="w-[320px] px-[6px]">Найменування матеріалу</div>
            <div className="w-[100px] text-center px-[6px]">Ціна, грн</div>
            <div className="w-[180px] px-[6px] text-center">
              Орієнтовна Кількість
            </div>
            <div className="w-[96px] text-center">Од. вимір.</div>
            <div className="w-[180px] text-center">Залишок з поперед.</div>
            <div className="w-[100px] text-center">Доставка 1</div>
            <div className="w-[108px] text-center">Доставка 2</div>
            <div className="w-[108px] text-center">Залишок</div>
            <div className="w-[116px] text-center">Собівартість</div>
            <div className="w-[96px] text-center">Сума, грн</div>
          </div>
        </div>
      )}
    </div>
  );
};
