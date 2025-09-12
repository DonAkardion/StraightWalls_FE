import React from "react";
type InfoItemProps = {
  icon: string;
  label: string;
  onClick?: () => void;
};

export const ClientInfoItem = ({ icon, label, onClick }: InfoItemProps) => (
  <div
    className={`flex items-center gap-2 ${
      onClick ? "cursor-pointer hover:underline" : ""
    }`}
    onClick={onClick}
  >
    {icon && <img src={icon} alt={label} className="w-5 h-5 object-contain" />}
    <p className="text-black text-[14px]">{label}</p>
  </div>
);
