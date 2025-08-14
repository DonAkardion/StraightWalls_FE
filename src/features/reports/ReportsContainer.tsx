type Props = {
  children: React.ReactNode;
};

export const ReportsContainer = ({ children }: Props) => {
  return (
    <div className="w-full pt-[60px] pl-[81px] pr-[59px] mb-20">
      {children}
    </div>
  );
};
