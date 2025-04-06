import SideMenuBottom from "./SideMenuBottom";
import SideMenuTop from "./SideMenuTopLogin";

export default function SideMenu({ isOpen, setIsOpen }) {
  return (
    <aside className="flex flex-col justify-between">
      <SideMenuTop></SideMenuTop>
      <SideMenuBottom></SideMenuBottom>
    </aside>
  );
}
