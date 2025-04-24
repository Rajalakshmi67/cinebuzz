import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { addReview } from '@/services/reviewService';

interface ReviewFormProps {
  movieId: string;
  onReviewAdded: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ movieId, onReviewAdded }) => {
  const { user, isAuth } = useAuthContext();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuth || !user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to write a review',
        variant: 'destructive'
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please select a rating for your review',
        variant: 'destructive'
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: 'Review Content Required',
        description: 'Please write some content for your review',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const reviewData = {
        movieId,
        rating,
        content,
        user: {
          id: user._id || 'guest',
          name: user.name || 'Guest User',
          avatar: user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'Guest'}`
        }
      };

      await addReview(reviewData);
      
      setContent('');
      setRating(0);
      onReviewAdded();
      
      toast({
        title: 'Review Submitted',
        description: 'Your review has been successfully submitted',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit your review',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-cinebuzz-card rounded-lg p-4 mb-6">
      <h4 className="text-white font-medium mb-3">Write a Review</h4>
      
      <div className="flex mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer ${
              star <= (hoveredRating || rating) ? 'text-cinebuzz-yellow' : 'text-gray-600'
            }`}
            fill={star <= (hoveredRating || rating) ? 'currentColor' : 'none'}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
          />
        ))}
      </div>
      
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts about this movie..."
        className="bg-cinebuzz-dark text-white resize-none mb-4"
        rows={4}
      />
      
      <Button 
        type="submit" 
        className="bg-cinebuzz-accent text-white hover:bg-cinebuzz-accent/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            Submitting...
          </span>
        ) : (
          'Submit Review'
        )}
      </Button>
    </form>
  );
};

export default ReviewForm; 