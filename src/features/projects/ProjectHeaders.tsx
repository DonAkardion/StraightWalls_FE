import React from "react";
type ProjectsHeadersProps = {
  headers: string[];
  className?: string;
};

export const ProjectsHeaders: React.FC<ProjectsHeadersProps> = ({
  headers, className
}) => {
  return (
    <>
      {headers.map((header, index) => (
        <h3 key={index} className={`${className} w-full`}>
          {header}
        </h3>
      ))}
      </>
  );
};
