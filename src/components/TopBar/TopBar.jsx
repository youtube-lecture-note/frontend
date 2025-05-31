import { Link } from "react-router-dom";
import Logo from "../../assets/Logo/Logo.png";
import useCategoryStore from "../../store/categoryStore";
import Button from "../Button";

import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const { selectCategory } = useCategoryStore();
  const navigate = useNavigate();

  function handleLogoClick() {
    selectCategory(1);
    navigate("/");
  }

  return (
    <nav className="bg-[#f3f6fb] shadow-md p-1 rounded-md mb-4 border-2 border-gray-300">
      <div className="flex justify-between items-center">
        <Button className="flex items-center" onClick={handleLogoClick}>
          <img src={Logo} alt="Logo" className="h-8 w-8" />
        </Button>
      </div>
    </nav>
  );
}
