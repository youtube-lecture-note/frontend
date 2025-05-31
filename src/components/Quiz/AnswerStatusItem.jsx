export default function AnswerStatusItem({ index, answer }) {
  let bgColor = answer ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600";

  return (
    <div
      className={`w-8 h-8 flex items-center justify-center rounded-full ${bgColor} font-medium`}
      title={answer ? "답변함" : "미답변"}
    >
      {index}
    </div>
  );
}
