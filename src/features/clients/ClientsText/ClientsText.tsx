import React from "react";
type ClientsTextProps = {
  clientsText: string[];
  className?: string;
};

export const ClientsText: React.FC<ClientsTextProps> = ({ clientsText, className }) => {
  return (
    <div>
        {clientsText.map((text, index) => (
            <label key={index} className={`text-black text-[20px] ${className}`}>
            {text}
            </label>
        ))}
    </div>
  );
};


