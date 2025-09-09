import { useState, useRef, useEffect } from 'react';

const ProfileDropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (action: string) => {
    console.log(`${action} clicked`);
    // Add your navigation logic here
    setIsOpen(false);
  };

  return (
    <div className="absolute top-4 right-4 z-50 component-override" ref={dropdownRef}>
      {/* Profile Picture Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="component-override w-20 h-20 rounded-full overflow-hidden border-3 border-gray-900 shadow-lg hover:border-gray-400 transition-colors"
      >
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="profile-dropdown-menu absolute right-0 top-22 bg-white border border-gray-200 rounded-lg shadow-lg z-50" style={{ width: '200px' }}>
          {/* Profile Header */}
          <div className="p-8 border-b border-gray-100 text-center">
            <div className="w-30 h-30 mx-auto mb-2 rounded-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm font-medium text-black">John Doe</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => handleMenuClick('Favorites')}
              className="menu-item w-full px-6 py-2 text-left text-sm text-black hover:bg-gray-400 transition-colors"
            >
              Favorites
            </button>
            <button
              onClick={() => handleMenuClick('Reviews')}
              className="menu-item w-full px-6 py-2 text-left text-sm text-black hover:bg-gray-300 transition-colors"
            >
              Reviews
            </button>
            <button
              onClick={() => handleMenuClick('History')}
              className="menu-item w-full px-6 py-2 text-left text-sm text-black hover:bg-gray-300 transition-colors"
            >
              History
            </button>
            <div className="border-t border-gray-300 mt-2 pt-2 bg-gray-50">
              <button
                onClick={() => handleMenuClick('Logout')}
                className="border-transparent logout-item w-full px-6 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdownMenu;
