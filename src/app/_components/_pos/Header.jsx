const Header = () => {
    return (
      <div className="flex justify-between items-center p-4 bg-gray-200">
        <input type="text" placeholder="Cari Menu" className="px-4 py-2 border rounded-lg"/>
        <button className="bg-blue-900 text-white px-4 py-2 rounded-lg">Custom Menu</button>
      </div>
    );
  };
  
  export default Header;
  