import SideMenuBottom from "./SideMenuBottom";
import SideMenuTop from "./SideMenuTopLogin";

export default function SideMenu({ isOpen, setIsOpen }) {
  return (
    <aside className="flex flex-col justify-between h-full overflow-hidden">
      <div className="overflow-y-auto flex flex-col h-full">
        <SideMenuTop />
        <div className="flex-grow overflow-y-auto">
          <SideMenuBottom />
        </div>
      </div>
    </aside>
  );
}
