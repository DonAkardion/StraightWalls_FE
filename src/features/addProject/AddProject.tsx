"use client";
import React from "react";
import styles from "./AddProject.module.css";
export function AddProject() {
  return (
    <section
      className={`${styles.clients} max-w-[1126px] m-auto pt-[48px] pl-[20px] pb-[250px] pr-[20px] md:pt-[60px] md:pl-[60px] md:pr-[60px]`}
    >
      <h1>AddProject</h1>
      <div>ClientSelect</div>
      <div>CostEstimate</div>
      <div>MaterialEarnings</div>
      <button>Send</button>
    </section>
  );
}
