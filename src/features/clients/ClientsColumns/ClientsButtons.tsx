type ProjectsButtonsProps = { 
  icon: { src: string } | string;
  alt: string;
  onClick: () => void;
  className?: string;
};

export const IconButton: React.FC<ProjectsButtonsProps> = ({
  icon,
  alt,
  onClick,
  className = "",
}) => {
  const iconElement = typeof icon === "string" ? icon : icon.src;

  return (
    <button className={className} onClick={onClick} aria-label={alt}>
      <img
        src={iconElement}
        alt={alt}
        className="w-5 h-5 object-contain cursor-pointer"
      />
    </button>
  );
};
