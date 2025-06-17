
import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
}

interface ProductReviewsProps {
  productId: string;
  rating: number;
  reviewCount: number;
}

const ProductReviews = ({ productId, rating, reviewCount }: ProductReviewsProps) => {
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);

  // Mock reviews data
  const reviews: Review[] = [
    {
      id: '1',
      author: 'Sarah M.',
      rating: 5,
      comment: 'Absolutely love this product! The quality is outstanding and it exceeded my expectations. Highly recommend to anyone looking for premium quality.',
      date: '2024-01-15',
      helpful: 12,
      verified: true
    },
    {
      id: '2',
      author: 'Mike R.',
      rating: 4,
      comment: 'Great product overall. Fast shipping and exactly as described. Only minor issue was the packaging could be better.',
      date: '2024-01-10',
      helpful: 8,
      verified: true
    },
    {
      id: '3',
      author: 'Emma L.',
      rating: 5,
      comment: 'Perfect! This is my second purchase and the quality remains consistent. Customer service is also excellent.',
      date: '2024-01-05',
      helpful: 15,
      verified: false
    }
  ];

  const handleSubmitReview = () => {
    if (newReview.trim()) {
      // Here you would typically submit to your backend
      console.log('Submitting review:', { rating: newRating, comment: newReview });
      setNewReview('');
      setNewRating(5);
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Customer Reviews</h3>
        
        {/* Rating Summary */}
        <div className="flex items-center gap-6 mb-6 p-6 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-1">{rating}</div>
            {renderStars(rating)}
            <div className="text-sm text-gray-600 mt-1">{reviewCount} reviews</div>
          </div>
          
          <div className="flex-1">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-8">{star}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full" 
                      style={{ width: `${Math.random() * 80 + 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Write a Review */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            {renderStars(newRating, true, setNewRating)}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
            <Textarea
              placeholder="Share your thoughts about this product..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              rows={4}
            />
          </div>
          
          <Button onClick={handleSubmitReview} className="bg-gray-900 hover:bg-gray-800">
            Submit Review
          </Button>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-medium text-gray-900">{review.author}</span>
                  {review.verified && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Verified Purchase
                    </span>
                  )}
                </div>
                {renderStars(review.rating)}
              </div>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>
            
            <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Was this helpful?</span>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <ThumbsUp className="h-4 w-4 mr-1" />
                Yes ({review.helpful})
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <ThumbsDown className="h-4 w-4 mr-1" />
                No
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;
