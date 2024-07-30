import { PiSpinnerGapLight } from "react-icons/pi";

function Loading() {
  return (
    <div className="min-h-screen z-50 flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-y-2">
        <PiSpinnerGapLight size="3.5rem" className="animate-spin " />
        <span>Memuat...</span>
      </div>
    </div>
  );
}

export default Loading;
