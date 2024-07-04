import { FiAlignLeft } from "react-icons/fi";

function MobileBurgerButton({ setIsOpen }) {
  return (
    <button onClick={() => setIsOpen()}>
      <FiAlignLeft size="1.3rem" color="#2D3250" />
    </button>
  );
}

export default MobileBurgerButton;
