"use client";
import React from "react";

import { CrewProvider } from "../../../../features/addWorker/addWorkerContext";

export default function WorkersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CrewProvider>{children}</CrewProvider>;
}
