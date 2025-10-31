import React, { useState } from 'react';
import { searchProducts } from '../services/spoonacularService';
import { Product } from '../types';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import ProductCard from '../components/ProductCard';

const Products: React.FC = () => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const results = await searchProducts(query);
      setProducts(results.products);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Search Products</h1>
      <p className="text-gray-600 mb-6">Find information about packaged food products.</p>
      
      <form onSubmit={handleSearch} className="flex items-center mb-8 bg-white rounded-full shadow-md">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., organic whole milk"
          className="w-full bg-transparent px-6 py-3 text-gray-700 focus:outline-none"
        />
        <button type="submit" className="p-3 bg-purple-500 text-white rounded-full m-1 hover:bg-purple-600">
          <MagnifyingGlassIcon className="h-6 w-6" />
        </button>
      </form>

      {loading && <div className="text-center p-8">Searching for products...</div>}
      {error && <div className="text-center p-8 text-red-500">{error}</div>}
      
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.length > 0 ? products.map(product => (
            <ProductCard key={product.id} product={product} />
          )) : searched && <p className="col-span-full text-center text-gray-500">No products found for that search.</p>}
        </div>
      )}
    </div>
  );
};

export default Products;
