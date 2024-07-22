import { TbFaceIdError } from "react-icons/tb";

function EmptyList({ title, description }) {
  return (
    <div className={`mt-60 flex flex-col items-center`}>
      <TbFaceIdError size="9rem" className="text-qraccent/50" />
      <div className="mt-6 flex flex-col items-center text-qraccent">
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="">{description}</p>
      </div>
    </div>
  );
}

export default EmptyList;
