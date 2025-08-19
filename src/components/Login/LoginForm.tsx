"use client";
import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import { Person } from "../../../public/icons";

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div
      className={`${styles.loginContainer} flex h-screen items-center justify-center`}
    >
      <form
        onSubmit={handleSubmit}
        className={`${styles.loginForm} p-6 rounded-xl w-80 flex flex-col`}
      >
        <h1 className={`${styles.loginFormTytle} mb-4 text-center`}>Увійти</h1>
        <div className="flex justify-center ">
          <img
            className={`${styles.mobileMenuUserIcon} w-[68px] h-[74px] mb-4`}
            src={Person.src}
            alt="User"
          />
        </div>
        <input
          className={`${styles.loginFormInput} w-full border-b-1 px-3 py-2 mb-3`}
          placeholder="Логін"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className={`${styles.loginFormInput} w-full border-b-1 px-3 py-2 mb-3`}
          placeholder="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className={`${styles.loginFormBtn} w-[80%] py-2 rounded-[5px] `}
          >
            Увійти
          </button>
        </div>
      </form>
    </div>
  );
}
