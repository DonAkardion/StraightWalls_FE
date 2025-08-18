"use client";
import React from "react";
import styles from "./ProjectNotes.module.css";

interface ProjectNotesProps {
  title?: string; // заголовок секції
  subtitle?: string; // підзаголовок
  notes: string[]; // масив приміток
}

export function ProjectNotes({
  title = "Примітки",
  subtitle,
  notes,
}: ProjectNotesProps) {
  if (!notes || notes.length === 0) return null;
  return (
    <section className={`${styles.notes} mb-[40px]`}>
      <h2 className={`${styles.notesTytle} mb-[16px]`}>{title}</h2>
      {subtitle && (
        <h3 className={`${styles.notesText} mb-[30px]`}>{subtitle}</h3>
      )}
      <ul className={`${styles.notesList} flex flex-col gap-[25px]`}>
        {notes.map((note, index) => (
          <li key={index} className={styles.notesListItem}>
            <div className={styles.notesListItemNumber}>{index + 1}</div>
            <div className={styles.notesListItemText}>{note}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
