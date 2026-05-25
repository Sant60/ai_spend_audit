import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="shadow outset-shadow-sm inset-shadow-black bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-xl font-bold text-black">
          AI Spend Audit
        </Link>

        <Link href="/audit" className=" text-sm font-bold text-white ">
          Start Audit
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
