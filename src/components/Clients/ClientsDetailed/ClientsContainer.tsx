type Props = {
  children: React.ReactNode;
};

export const ClientsContainer = ({ children }: Props) => {
  return (
    <div className="max-w-[1126px] m-auto pt-[60px] pl-[81px] pr-[59px]">
      {children}
    </div>
  );
};