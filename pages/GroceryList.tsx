
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { GroceryItem } from '../types';
import { TrashIcon, PrinterIcon, PlusIcon, PencilIcon } from '@heroicons/react/24/solid';

const GroceryList: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [newItem, setNewItem] = useState('');
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);
  const [editText, setEditText] = useState('');

  const handleToggle = (original: string) => {
    dispatch({ type: 'TOGGLE_GROCERY_ITEM', payload: original });
  };
  
  const handleClear = () => {
    if(window.confirm('Are you sure you want to clear the entire grocery list?')) {
        dispatch({ type: 'CLEAR_GROCERIES' });
    }
  };
  
  const handlePrint = () => {
    window.print();
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
        dispatch({ type: 'ADD_CUSTOM_GROCERY_ITEM', payload: newItem });
        setNewItem('');
    }
  };

  const handleStartEdit = (item: GroceryItem) => {
      setEditingItem(item);
      setEditText(item.original);
  };

  const handleSaveEdit = (original: string) => {
      if (editText.trim() && editText.trim().toLowerCase() !== original.toLowerCase()) {
          dispatch({ type: 'EDIT_GROCERY_ITEM', payload: { original, newText: editText.trim() } });
      }
      setEditingItem(null);
      setEditText('');
  };

  const handleCancelEdit = () => {
      setEditingItem(null);
      setEditText('');
  };

  const groupedList = state.groceryList.reduce((acc, item) => {
    const aisle = item.aisle || 'Uncategorized';
    if (!acc[aisle]) {
      acc[aisle] = [];
    }
    acc[aisle].push(item);
    return acc;
  }, {} as Record<string, GroceryItem[]>);

  // Sort items within each aisle alphabetically
  for (const aisle in groupedList) {
    groupedList[aisle].sort((a, b) => a.original.localeCompare(b.original));
  }

  const sortedAisles = Object.keys(groupedList).sort();

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-3xl font-bold text-gray-800">Grocery List</h1>
        <div className="flex gap-2">
            <button onClick={handlePrint} className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-100">
                <PrinterIcon className="h-6 w-6"/>
            </button>
            <button onClick={handleClear} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100">
                <TrashIcon className="h-6 w-6"/>
            </button>
        </div>
      </div>

      <form onSubmit={handleAddItem} className="mb-6 flex gap-2 print:hidden">
        <input 
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add custom item (e.g., Paper towels)"
          className="flex-grow w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
        />
        <button type="submit" className="bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 disabled:bg-gray-300" disabled={!newItem.trim()}>
            <PlusIcon className="h-6 w-6"/>
        </button>
      </form>

      {state.groceryList.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">Your grocery list is empty.</p>
            <p className="text-sm text-gray-400 mt-2">Add ingredients from a recipe or use the form above.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedAisles.map(aisle => (
            <div key={aisle} className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-green-700 mb-3 capitalize border-b pb-2">{aisle}</h2>
              <ul className="space-y-3">
                {groupedList[aisle].map((item, index) => (
                  <li key={`${item.id}-${index}`} className="flex items-center justify-between group">
                    <div className="flex items-center flex-grow min-w-0">
                      <input
                        type="checkbox"
                        id={item.original}
                        checked={item.checked}
                        onChange={() => handleToggle(item.original)}
                        className="h-5 w-5 rounded text-orange-500 focus:ring-orange-500 border-gray-300 flex-shrink-0"
                      />
                      {editingItem?.original === item.original ? (
                        <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit(item.original);
                                if (e.key === 'Escape') handleCancelEdit();
                            }}
                            onBlur={() => handleSaveEdit(item.original)}
                            className="ml-3 w-full bg-transparent border-b-2 border-orange-500 focus:outline-none"
                            autoFocus
                        />
                      ) : (
                        <label htmlFor={item.original} className={`ml-3 text-gray-700 truncate ${item.checked ? 'line-through text-gray-400' : ''}`}>
                            {item.original}
                        </label>
                      )}
                    </div>
                    {editingItem?.original !== item.original && (
                        <button onClick={() => handleStartEdit(item)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 ml-2 flex-shrink-0">
                            <PencilIcon className="h-4 w-4 text-gray-400 hover:text-gray-600"/>
                        </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroceryList;
