import { PiSpinnerGapLight } from "react-icons/pi";

function Loading() {
  return (
    <div className="flex flex-grow items-center justify-center lg:ml-80 lg:w-auto w-screen">
      <div className="flex flex-col justify-center items-center gap-y-2">
        <PiSpinnerGapLight size="3.5rem" className="animate-spin " />
        <span>Memuat...</span>
      </div>
    </div>
  );
}

export default Loading;
