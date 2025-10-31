import React, { useState } from 'react';
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const TopHeader: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/recipes?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 md:hidden">
      <div className="relative flex items-center justify-center p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Balanced Bowl</h1>
        <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4">
            <button className="text-gray-600 hover:text-gray-800">
            <Bars3Icon className="h-6 w-6" />
            </button>
        </div>
      </div>
      <div className="p-4 bg-white">
        <form onSubmit={handleSearch} className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-lg border-0 bg-gray-100 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm"
            placeholder="Quick find: tags, recipes & more"
          />
        </form>
      </div>
    </header>
  );
};

export default TopHeader;
