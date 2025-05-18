import { useState } from "react";
import { useRef } from "react";

import Button from "../Button";
import Modal from "../Modal";
import Input from "../Input";

export default function SideMenuBottom() {
  const [subjects, setSubjects] = useState(["미분류", "과학", "자격증"]); // 임시 데이터
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  const handleAddSubject = () => {
    const newSubject = inputRef.current.value;
    if (newSubject && !subjects.includes(newSubject)) {
      setSubjects([...subjects, newSubject]);
    }
    setIsOpen(false);
  };

  const handleSubjectClick = (subject) => {
    console.log(subject);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Subject</h2>
        <Button onClick={() => setIsOpen(true)} variant="AddSubject">
          +
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        {subjects.map((subject, index) => (
          <Button
            key={index}
            variant="Subject"
            onClick={() => handleSubjectClick(subject)}
          >
            {subject}
          </Button>
        ))}
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="주제 추가"
        variant="AddSubject"
        inputRef={inputRef}
      >
        <div className="flex flex-row gap-2">
          <Input ref={inputRef} variant="AddSubject" />
          <Button onClick={handleAddSubject}>+</Button>
        </div>
      </Modal>
    </div>
  );
}
