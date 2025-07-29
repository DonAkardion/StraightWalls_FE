import React from "react";

interface INavigationButton {
  onClick: () => void;
  dynamicPosition?: { bottom: string };
  isScrolling?: boolean;
}

export const NavigationButton: React.FC<INavigationButton> = ({
  onClick,
  dynamicPosition,
  isScrolling = false,
}) => <div className=""></div>;
