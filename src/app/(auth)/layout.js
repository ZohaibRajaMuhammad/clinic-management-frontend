import Image from "next/image";

function Layout({ children }) {
  return (
    <div className="w-full min-h-screen  flex flex-col md:flex-row justify-center md:justify-start md:gap-15 items-center ">
       {/* Left Side (Form Section) */}
       <div className="hidden md:block relative w-full md:w-[38%] h-screen">
        <Image
          src="/assets/AuthSideBar.png"
          alt="Auth Illustration"
          fill
          className="object-bottom"
        />
      </div> 
     
       {/* Right Side  */}
      <div className="w-full md:w-[52%] pt-5 px-5 md:px-0 flex justify-center md:block">
        <div className="max-w-xl w-full">
          {/* <h1 className="text-2xl font-semibold text-center md:text-left">Expense Tracker</h1> */}
          <div className="mt-3 ">{children}</div>
        </div>
      </div>

     
      
    </div>
  );
}

export default Layout;
