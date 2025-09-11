"use client";

import React from "react";
import { useProjectCreation } from "@/features/addProject/ProjectCreationContext/ProjectCreationContext";
import styles from "./ProjectNameInput.module.css";

interface Props {
  onUserInput?: () => void;
}

export const ProjectNameInput = ({ onUserInput }: Props) => {
  const { name, setName } = useProjectCreation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (onUserInput) onUserInput();
  };

  return (
    <div className={`${styles.wrapper} w-[70%]`}>
      <div className="border rounded p-[20px] md:px-[40px] md:py-[16px] w-full bg-white">
        <input
          id="projectName"
          type="text"
          value={name}
          onChange={handleChange}
          placeholder="Введіть назву проєкту"
          className={`${styles.input} w-full outline-none`}
        />
      </div>
    </div>
  );
};
