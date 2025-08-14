import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";

interface TooltipWrapperProps {
  tooltipText?: string;
  children: React.ReactNode;
}

export const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  tooltipText,
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const wrapperRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX + rect.width / 2,
      });
      setVisible(true);
    }
  };

  const hideTooltip = () => setVisible(false);

  if (!tooltipText) return <>{children}</>;

  return (
    <>
      <span
        ref={wrapperRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className=" contants cursor-help "
      >
        {children}
      </span>
      {visible &&
        createPortal(
          <div
            className="hidden md:flex"
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              transform: "translateX(-50%)",
              backgroundColor: "lightGray",
              color: "black",
              padding: "4px 8px",
              borderRadius: "4px",
              whiteSpace: "nowrap",
              zIndex: 10,
              pointerEvents: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            {tooltipText}
          </div>,
          document.body
        )}
    </>
  );
};
