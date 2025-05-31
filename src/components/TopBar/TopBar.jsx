import useCategoryStore from "../../store/categoryStore";
import Button from "../Button";
import { FaYoutube } from "react-icons/fa"; // YouTube 아이콘 추가
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const { selectCategory } = useCategoryStore();
  const navigate = useNavigate();

  function handleLogoClick() {
    selectCategory(1);
    navigate("/");
  }

  return (
    <nav className="bg-white shadow-md p-2 rounded-md mb-4 border border-gray-200">
      <div className="flex justify-between items-center">
        <Button className="flex items-center" onClick={handleLogoClick}>
          <FaYoutube className="text-red-600 h-8 w-8" />{" "}
          {/* YouTube 빨간 로고 아이콘 */}
        </Button>
      </div>
    </nav>
  );
}
