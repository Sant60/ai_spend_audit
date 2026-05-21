import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 border-b">
      <h1 className="text-xl font-bold">AI Audit</h1>

      <Link href="/audit">Start Audit</Link>
    </nav>
  );
};

export default Navbar;
