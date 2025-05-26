import Button from "./Button";

export default function Modal({
  isOpen,
  onClose,
  title,
  variant,
  children,
  ...props
}) {
  if (variant === "NeedYoutubeURL") {
  } else if (variant === "AddSubject") {
    // 주제 추가 모달
  }

  return (
    isOpen && (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <div className="flex flex-row justify-between w-full pb-6 text-left">
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <Button onClick={onClose} variant="Close">
              X
            </Button>
          </div>
          <div className="w-full">{children}</div>
        </div>
      </div>
    )
  );
}
