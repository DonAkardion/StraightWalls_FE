type Props = {
  children: React.ReactNode;
};

export const ManageCustomersContainer = ({ children }: Props) => {
  return (
    <div
      className="
        max-w-[1126px] 
        m-auto 
        pt-[30px] 
        px-4 
        sm:px-6 
        md:pt-[60px] 
        md:pl-[81px] 
        md:pr-[59px] 
        mb-20
      "
    >
      {children}
    </div>
  );
};
