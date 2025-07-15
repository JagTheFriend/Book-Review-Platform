
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { User, Edit2, BookOpen, MessageSquare, Heart, Calendar, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usersApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProfileEditForm from '@/components/ProfileEditForm';

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const { data: userData, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => usersApi.getById(userId!),
    enabled: !!userId,
  });

  const profileUser = userData?.data || user;
  const isOwnProfile = user?.id === userId;

  const handleEditStart = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEditSave = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">User not found</h2>
          <p className="text-gray-600">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Mock data for demonstration
  const userStats = {
    reviewsCount: 12,
    favoriteBooks: 8,
    joinDate: '2023-06-15',
  };

  const recentReviews = [
    {
      id: '1',
      bookTitle: 'The Great Gatsby',
      bookAuthor: 'F. Scott Fitzgerald',
      review: 'A masterpiece that perfectly captures the American Dream and its contradictions...',
      rating: 5,
      date: '2024-01-15',
    },
    {
      id: '2',
      bookTitle: 'To Kill a Mockingbird',
      bookAuthor: 'Harper Lee',
      review: 'An incredible story about justice, morality, and growing up...',
      rating: 4,
      date: '2024-01-10',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl">
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    {isEditing ? (
                      <ProfileEditForm 
                        onCancel={handleEditCancel}
                        onSave={handleEditSave}
                      />
                    ) : (
                      <>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                          {profileUser.username}
                          {profileUser.role === 'ADMIN' && (
                            <Crown className="h-6 w-6 text-yellow-500 ml-2" />
                          )}
                        </h1>
                        <Badge variant={profileUser.role === 'ADMIN' ? 'default' : 'secondary'} className="mt-2">
                          {profileUser.role}
                        </Badge>
                      </>
                    )}
                  </div>
                  {isOwnProfile && !isEditing && (
                    <Button onClick={handleEditStart} variant="outline" size="sm">
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
                
                {/* Stats */}
                {!isEditing && (
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{userStats.reviewsCount}</div>
                      <div className="text-sm text-gray-600">Reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{userStats.favoriteBooks}</div>
                      <div className="text-sm text-gray-600">Favorites</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {new Date(userStats.joinDate).getFullYear()}
                      </div>
                      <div className="text-sm text-gray-600">Member Since</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Content */}
        {!isEditing && (
          <Tabs defaultValue="reviews" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reviews" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center">
                <Heart className="h-4 w-4 mr-2" />
                Favorites
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                  <CardDescription>
                    {isOwnProfile ? 'Your' : `${profileUser.username}'s`} latest book reviews
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentReviews.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                      <p className="text-gray-600">
                        {isOwnProfile ? "You haven't" : `${profileUser.username} hasn't`} written any reviews yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {recentReviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-lg">{review.bookTitle}</h4>
                              <p className="text-gray-600">by {review.bookAuthor}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <BookOpen
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.review}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle>Favorite Books</CardTitle>
                  <CardDescription>
                    Books that {isOwnProfile ? 'you have' : `${profileUser.username} has`} marked as favorites
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
                    <p className="text-gray-600">
                      {isOwnProfile ? "You haven't" : `${profileUser.username} hasn't`} added any books to favorites yet.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                  <CardDescription>
                    Recent activity and engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No recent activity</h3>
                    <p className="text-gray-600">
                      No recent activity to display.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
