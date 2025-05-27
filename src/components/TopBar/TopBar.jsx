import { Link } from "react-router-dom";
import Logo from "../../assets/Logo/Logo.png";

export default function TopBar() {
  return (
    <nav className="bg-[#f3f6fb] shadow-md p-1 rounded-md mb-4 border-2 border-gray-300">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="h-8 w-8" />
        </Link>
      </div>
    </nav>
  );
}
