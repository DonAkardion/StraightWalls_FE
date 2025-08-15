type Props = {
  children: React.ReactNode;
};

export const ReportsContainer = ({ children }: Props) => {
  return (
    <div className="max-w-[1126px] m-auto pt-[60px] pl-[81px] pr-[59px] mb-20">
      {children}
    </div>
  );
};
