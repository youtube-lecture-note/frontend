import { Link } from "react-router-dom";
import Logo from "../../assets/Logo/Logo.png";

export default function TopBar() {
  return (
    <nav className="bg-white shadow-md p-1 bg-blue-200">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="h-8 w-8" />
        </Link>
      </div>
    </nav>
  );
}
