import Spinner from "../assets/Loading/Spinner1.gif";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
        <img src={Spinner} alt="Loading" className="w-16 h-16" />
      </div>
    </div>
  );
}
