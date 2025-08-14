import React from "react";
import { mockMessages } from "@/mock/NavigationMessage/navigationMessage";

export const ForNavigationMessage = () => {
  return (
    <div className="px-2 mt-4 text-[14px] font-inter text-black space-y-2 text-center">
      {mockMessages.map((interaction, index) => (
        <div key={index}>
          {index === 0 && <div className="border-t border-[#FFB326] mb-1" />}

          <div className="pb-2">
            <div>
              <span>{interaction.title}</span>
            </div>
            <div>
              <span className="text-red-600 font-semibold">
                {interaction.price} грн
              </span>
            </div>
          </div>

          {index === 0 && <div className="border-b border-[#FFB326] mt-1" />}
        </div>
      ))}
    </div>
  );
};
