export default function AnswerStatusItem({ index, answer }) {
  let isAnswered = answer !== null && answer !== "";

  return (
    <div className="flex items-center space-x-4">
      <div
        className={`w-8 h-8 flex items-center justify-center rounded ${
          isAnswered ? "bg-blue-400" : "bg-gray-100"
        }`}
      >
        {index}
      </div>
    </div>
  );
}
