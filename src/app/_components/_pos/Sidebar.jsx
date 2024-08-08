import { FaBars } from 'react-icons/fa';

const Sidebar = ({ isMinimized, toggleSidebar, setSelectedCategory, categories }) => {
  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div className={`bg-slate-500 text-white flex flex-col items-center transition-all duration-300 ${isMinimized ? 'w-16' : 'w-40'} p-4 rounded-r-lg min-h-screen`}>
      <button onClick={toggleSidebar} className="text-white mb-4">
        <FaBars />
      </button>
      <div className={`flex flex-col min-h-screen ${isMinimized ? 'space-y-2 mt-6' : 'space-y-4 mt-8'} items-center`}>
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => setSelectedCategory(category.name)}
            className={`cursor-pointer transform ${isMinimized ? '-rotate-90 origin-center text-xs p-12' : 'rotate-0 text-base'} whitespace-nowrap`}
          >
            {category.name}
          </div>
        ))}
        <div
          onClick={() => handleNavigation('/activity')}
          className={`cursor-pointer transform ${isMinimized ? '-rotate-90 origin-center text-xs p-12' : 'rotate-0 text-base'} whitespace-nowrap`}
        >
          Activity
        </div>
        <div
          onClick={() => handleNavigation('/shift')}
          className={`cursor-pointer transform ${isMinimized ? '-rotate-90 origin-center text-xs p-12' : 'rotate-0 text-base'} whitespace-nowrap`}
        >
          Shift Management
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
