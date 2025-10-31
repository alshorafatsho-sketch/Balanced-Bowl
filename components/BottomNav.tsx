import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, MagnifyingGlassIcon, CalendarDaysIcon, ShoppingCartIcon, PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';

const navItems = [
  { path: '/', label: 'Home', icon: HomeIcon },
  { path: '/recipes', label: 'Recipes', icon: MagnifyingGlassIcon },
  { path: 'ADD_BUTTON', label: 'Add', icon: PlusIcon }, // Placeholder for the central button
  { path: '/planner', label: 'Planner', icon: CalendarDaysIcon },
  { path: '/groceries', label: 'Groceries', icon: ShoppingCartIcon },
];

const BottomNav: React.FC = () => {
  const activeLinkStyle = { color: '#f97316' }; // orange-500
  const defaultStyle = { color: '#4b5563' }; // gray-600

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.1)] md:left-0 md:top-0 md:bottom-0 md:right-auto md:w-20 md:shadow-[1px_0_3px_rgba(0,0,0,0.1)] z-50">
      {/* Desktop Sidebar */}
      <ul className="hidden md:flex flex-col h-full justify-start pt-8 gap-y-8 items-center">
         <li className="mb-4">
          <SparklesIcon className="h-8 w-8 text-green-500"/>
        </li>
        {[
          { path: '/', label: 'Home', icon: HomeIcon },
          { path: '/recipes', label: 'Recipes', icon: MagnifyingGlassIcon },
          { path: '/planner', label: 'Planner', icon: CalendarDaysIcon },
          { path: '/groceries', label: 'Groceries', icon: ShoppingCartIcon },
        ].map(({ path, icon: Icon }) => (
          <li key={path}>
            <NavLink to={path} style={({ isActive }) => (isActive ? activeLinkStyle : defaultStyle)} className="flex flex-col items-center justify-center w-full h-full text-xs transition-colors duration-200 hover:text-orange-500">
              <Icon className="h-6 w-6" />
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Mobile Bottom Bar */}
      <ul className="flex md:hidden justify-around items-center h-16">
        {navItems.map(({ path, label, icon: Icon }, index) => (
          <li key={path} className="flex-1">
            {path === 'ADD_BUTTON' ? (
              <NavLink to="/recipes" className="relative -top-4 flex justify-center">
                  <div className="flex items-center justify-center w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg">
                      <Icon className="h-8 w-8" />
                  </div>
              </NavLink>
            ) : (
              <NavLink to={path} style={({ isActive }) => (isActive ? activeLinkStyle : defaultStyle)} className="flex flex-col items-center justify-center w-full h-full text-xs transition-colors duration-200 hover:text-orange-500">
                <Icon className="h-6 w-6 mb-1" />
                <span>{label}</span>
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNav;
