import { FaSearch } from 'react-icons/fa';

const Header = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center w-96 bg-white rounded-md shadow p-2">
        <input
          type="text"
          placeholder="Search Menu"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="outline-none px-2 w-96"
        />
        <FaSearch className="text-gray-400" />
      </div>
    </div>
  );
};

export default Header;
