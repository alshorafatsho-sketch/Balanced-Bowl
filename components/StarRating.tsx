import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  isInteractive?: boolean;
  starSize?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating = 0, 
  onRatingChange, 
  isInteractive = false,
  starSize = "h-5 w-5"
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseOver = (index: number) => {
    if (isInteractive) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (isInteractive) {
      setHoverRating(0);
    }
  };

  const handleClick = (index: number) => {
    if (isInteractive && onRatingChange) {
      onRatingChange(index);
    }
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((index) => {
        const displayRating = hoverRating || rating;
        return (
          <button
            key={index}
            onMouseOver={() => handleMouseOver(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
            disabled={!isInteractive}
            className={`text-yellow-400 ${isInteractive ? 'cursor-pointer' : ''}`}
            aria-label={`Rate ${index} stars`}
          >
            {displayRating >= index ? (
              <StarIcon className={starSize} />
            ) : (
              <StarIconOutline className={starSize} />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;