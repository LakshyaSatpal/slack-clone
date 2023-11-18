const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full container py-20 flex justify-center items-center">
      {children}
    </div>
  );
};

export default AuthLayout;
