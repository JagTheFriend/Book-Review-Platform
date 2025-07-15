
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, BookOpen, Star, Heart, Share2, Edit, MessageSquare, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { booksApi, reviewsApi } from '@/lib/api';
import { useBookContext } from '@/contexts/BookContext';
import { useUserContext } from '@/contexts/UserContext';
import LoadingSpinner from '@/components/LoadingSpinner';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newReview, setNewReview] = useState('');
  const [isWritingReview, setIsWritingReview] = useState(false);
  const { favoriteBooks, toggleFavorite } = useBookContext();
  const { currentUser } = useUserContext();
  const queryClient = useQueryClient();

  const { data: bookData, isLoading: isLoadingBook } = useQuery({
    queryKey: ['book', id],
    queryFn: () => booksApi.getById(id!),
    enabled: !!id,
  });

  const { data: reviewsData, isLoading: isLoadingReviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewsApi.getByBookId(id!),
    enabled: !!id,
  });

  const createReviewMutation = useMutation({
    mutationFn: (reviewData: { data: string; userId: string; bookId: string }) =>
      reviewsApi.create(reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
      setNewReview('');
      setIsWritingReview(false);
      toast({
        title: "Review submitted!",
        description: "Thank you for sharing your thoughts.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const book = bookData?.data;
  const reviews = reviewsData?.data || [];
  const isFavorite = book && favoriteBooks.includes(book.id);

  const handleSubmitReview = () => {
    if (!newReview.trim() || !currentUser || !book) return;

    createReviewMutation.mutate({
      data: newReview,
      userId: currentUser.id,
      bookId: book.id,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: book?.name,
          text: `Check out "${book?.name}" by ${book?.author}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Book link has been copied to your clipboard.",
      });
    }
  };

  if (isLoadingBook || isLoadingReviews) {
    return <LoadingSpinner />;
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Book not found</h2>
          <p className="text-gray-600 mb-4">The book you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/books')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Books
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/books')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Books
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-gray-400" />
                </div>
                <CardTitle className="text-2xl">{book.name}</CardTitle>
                <CardDescription className="text-lg">by {book.author}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">4.0</span>
                  <span className="text-gray-600">({reviews.length} reviews)</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{book.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={() => book && toggleFavorite(book.id)}
                    variant={isFavorite ? "default" : "outline"}
                    className="w-full"
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>
                  <Button onClick={handleShare} variant="outline" className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Book
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews Section */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Write Review */}
              {currentUser && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Edit className="h-5 w-5 mr-2" />
                      Write a Review
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!isWritingReview ? (
                      <Button
                        onClick={() => setIsWritingReview(true)}
                        className="w-full"
                      >
                        Share your thoughts about this book
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <Textarea
                          placeholder="What did you think about this book? Share your honest thoughts..."
                          value={newReview}
                          onChange={(e) => setNewReview(e.target.value)}
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSubmitReview}
                            disabled={!newReview.trim() || createReviewMutation.isPending}
                          >
                            {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsWritingReview(false);
                              setNewReview('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Reviews List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Reviews ({reviews.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                      <p className="text-gray-600">
                        Be the first to share your thoughts about this book!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review, index) => (
                        <div key={review.id || index}>
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage src="" />
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-semibold">Reader #{review.userId.slice(-4)}</span>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500 flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Just now
                                </span>
                              </div>
                              <p className="text-gray-700 leading-relaxed">{review.data}</p>
                            </div>
                          </div>
                          {index < reviews.length - 1 && <Separator className="mt-6" />}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
