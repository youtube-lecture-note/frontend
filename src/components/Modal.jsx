import Button from "./Button";

export default function Modal({ isOpen, onClose, title, children }) {
  return (
    isOpen && (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <Button onClick={onClose}>닫기</Button>
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          {children}
        </div>
      </div>
    )
  );
}
