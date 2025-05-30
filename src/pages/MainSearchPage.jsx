// 메인 검색화면
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../assets/Logo/Logo.png";
import SearchVideo from "../components/Search/SearchVideo";
import Button from "../components/Button";

export default function MainSearchPage() {
  const inputURLRef = useRef(null);
  const navigate = useNavigate();

  return (
    <div className="main-container flex flex-col justify-center items-center h-full max-w-5xl w-full mx-auto">
      <img src={Logo} alt="logo" className="main-logo w-40 h-40 mb-40" />
      <SearchVideo inputURLRef={inputURLRef} variant={"SearchVideo"} />
    </div>
  );
}
