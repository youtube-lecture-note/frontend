import Button from "./Button";
import { AiOutlineCloseCircle } from "react-icons/ai";

export default function Modal({
  isOpen,
  onClose,
  title,
  variant,
  children,
  showCloseButton = true,
  ...props
}) {
  return (
    isOpen && (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 z-50 border border-gray-200 p-4">
        <div className="bg-white rounded-lg shadow-md flex flex-col max-h-[80vh] max-w-4xl w-[90%] md:w-4/5 lg:w-3/4">
          <div className="flex flex-row justify-between w-full p-4 text-left items-center border-b border-gray-200 shrink-0">
            <h2 className="text-xl font-bold bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
              {title}
            </h2>
            {showCloseButton && (
              <Button onClick={onClose} variant="Close">
                <AiOutlineCloseCircle className="text-gray-600" />
              </Button>
            )}
          </div>

          <div className="overflow-y-auto p-6 flex-1">{children}</div>
        </div>
      </div>
    )
  );
}
