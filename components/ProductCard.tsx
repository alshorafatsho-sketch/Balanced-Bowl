import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group">
      <div className="relative aspect-square">
        <img src={product.image} alt={product.title} className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 truncate" title={product.title}>
          {product.title}
        </h3>
      </div>
    </div>
  );
};

export default ProductCard;
