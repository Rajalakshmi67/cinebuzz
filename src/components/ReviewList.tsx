import React from 'react';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Review } from '@/services/reviewService';
import { useAuthContext } from '@/context/AuthContext';

interface ReviewListProps {
  reviews: Review[];
  onDelete?: (reviewId: string) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, onDelete }) => {
  const { user } = useAuthContext();

  if (reviews.length === 0) {
    return (
      <div className="bg-cinebuzz-card rounded-lg p-4 text-center">
        <p className="text-cinebuzz-subtitle py-4">
          No reviews yet. Be the first to share your thoughts!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-cinebuzz-card rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start">
              <Avatar className="w-10 h-10 mr-3">
                <AvatarImage src={review.user.avatar} alt={review.user.name} />
                <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <h4 className="text-white font-medium">{review.user.name}</h4>
                  <div className="ml-3 flex">
                    {Array(5).fill(0).map((_, index) => (
                      <Star 
                        key={index} 
                        className={`h-4 w-4 ${index < review.rating ? 'text-cinebuzz-yellow' : 'text-gray-600'}`}
                        fill={index < review.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-cinebuzz-subtitle text-xs">{review.timestamp}</p>
              </div>
            </div>
            
            {onDelete && user && user._id === review.user.id && (
              <button 
                onClick={() => onDelete(review.id)}
                className="text-cinebuzz-subtitle hover:text-white text-sm"
              >
                Delete
              </button>
            )}
          </div>
          <p className="text-cinebuzz-subtitle">{review.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList; 