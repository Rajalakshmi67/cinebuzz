import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { 
  getCommunityPosts, 
  addCommunityPost, 
  togglePostLike,
  getMemberById,
  createMemberIfNotExists,
  CommunityPost,
  CommunityMember 
} from "../services/communityService";

const CommunityPage = () => {
  const { user, isAuth } = useAuthContext();
  const { toast } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [activeTab, setActiveTab] = useState("feed");
  const [isLoading, setIsLoading] = useState({
    posts: true,
    profile: false
  });
  const [currentUserProfile, setCurrentUserProfile] = useState<CommunityMember | null>(null);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(prev => ({ ...prev, posts: true }));
        const postsData = await getCommunityPosts();
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast({
          title: 'Error',
          description: 'Failed to load community posts',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(prev => ({ ...prev, posts: false }));
      }
    };

    fetchPosts();
  }, [toast]);

  // Fetch or create current user's profile if authenticated
  useEffect(() => {
    const fetchOrCreateUserProfile = async () => {
      if (isAuth && user?._id) {
        try {
          setIsLoading(prev => ({ ...prev, profile: true }));
          
          // Create a profile if it doesn't exist
          const profile = await createMemberIfNotExists({
            id: user._id,
            name: user.name || "User",
            profileImage: user.profileImage
          });
          
          setCurrentUserProfile(profile);
        } catch (error) {
          console.error('Error creating/fetching user profile:', error);
        } finally {
          setIsLoading(prev => ({ ...prev, profile: false }));
        }
      }
    };

    fetchOrCreateUserProfile();
  }, [isAuth, user]);

  const handleNewPost = async () => {
    if (!newPostContent.trim() || !isAuth || !user) return;

    try {
      // Make sure the user has a profile
      if (!currentUserProfile) {
        await fetchOrCreateUserProfile();
      }
      
      const postData = {
        user: {
          id: user._id || "guest",
          name: user.name || "Guest User",
          avatar: user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || "Guest"}`
        },
        content: newPostContent
      };

      const newPost = await addCommunityPost(postData);
      setPosts([newPost, ...posts]);
      setNewPostContent("");
      
      toast({
        title: 'Post Created',
        description: 'Your post has been shared with the community',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create your post',
        variant: 'destructive'
      });
    }
  };
  
  // Helper function to ensure user profile exists
  const fetchOrCreateUserProfile = async () => {
    if (isAuth && user?._id) {
      try {
        const profile = await createMemberIfNotExists({
          id: user._id,
          name: user.name || "User",
          profileImage: user.profileImage
        });
        
        setCurrentUserProfile(profile);
        return profile;
      } catch (error) {
        console.error('Error creating user profile:', error);
        return null;
      }
    }
    return null;
  };

  const handleLike = async (postId: string) => {
    if (!isAuth) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to like posts',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Make sure the user has a profile before liking
      if (!currentUserProfile) {
        await fetchOrCreateUserProfile();
      }
      
      const updatedPost = await togglePostLike(postId);
      if (updatedPost) {
        setPosts(posts.map(post => post.id === postId ? updatedPost : post));
      }
    } catch (error) {
      console.error('Error liking post:', error);
      toast({
        title: 'Error',
        description: 'Failed to like the post',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cinebuzz-dark to-black">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">CineBuzz Community</h1>
              <p className="text-gray-400">Connect with fellow cinephiles and discuss your favorite movies and TV shows</p>
            </div>
            {isAuth && !currentUserProfile && (
              <Button 
                className="mt-4 md:mt-0 bg-cinebuzz-accent hover:bg-cinebuzz-accent/90"
                onClick={fetchOrCreateUserProfile}
              >
                Join Community
              </Button>
            )}
          </div>

          <Tabs defaultValue="feed" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="feed">Community Feed</TabsTrigger>
              <TabsTrigger value="profile">My Profile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="feed" className="space-y-4">
              {isAuth ? (
                <Card className="bg-cinebuzz-dark-light border-none shadow">
                  <CardHeader>
                    <CardTitle className="text-white">Create Post</CardTitle>
                    <CardDescription>Share your thoughts with the community</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      placeholder="What's on your mind?" 
                      className="bg-cinebuzz-dark text-white resize-none"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      onClick={handleNewPost} 
                      disabled={!newPostContent.trim()}
                      className="bg-cinebuzz-accent hover:bg-cinebuzz-accent/90"
                    >
                      Post
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card className="bg-cinebuzz-dark-light border-none shadow">
                  <CardContent className="pt-6">
                    <div className="text-center py-4">
                      <p className="text-white mb-4">Sign in to join the conversation and post in the community</p>
                      <Link to="/signin">
                        <Button className="bg-cinebuzz-accent hover:bg-cinebuzz-accent/90">
                          Sign In
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {isLoading.posts ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cinebuzz-accent"></div>
                </div>
              ) : posts.length === 0 ? (
                <Card className="bg-cinebuzz-dark-light border-none shadow">
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <p className="text-white mb-4">No posts yet. Be the first to share your thoughts!</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => (
                  <Card key={post.id} className="bg-cinebuzz-dark-light border-none shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={post.user.avatar} alt={post.user.name} />
                          <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-white text-lg">{post.user.name}</CardTitle>
                          <CardDescription>{post.timestamp}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white">{post.content}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`text-sm ${post.liked ? 'text-cinebuzz-accent' : 'text-gray-400'}`}
                        onClick={() => handleLike(post.id)}
                      >
                        {post.liked ? 'Liked' : 'Like'} • {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-sm text-gray-400">
                        Comments • {post.comments}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="profile" className="space-y-4">
              {!isAuth ? (
                <Card className="bg-cinebuzz-dark-light border-none shadow">
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <p className="text-white mb-4">Sign in to view and manage your profile</p>
                      <Link to="/signin">
                        <Button className="bg-cinebuzz-accent hover:bg-cinebuzz-accent/90">
                          Sign In
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : isLoading.profile ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cinebuzz-accent"></div>
                </div>
              ) : currentUserProfile ? (
                // User has a profile
                <Card className="bg-cinebuzz-dark-light border-none shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={currentUserProfile.avatar} alt={currentUserProfile.name} />
                        <AvatarFallback>{currentUserProfile.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-white text-2xl">{currentUserProfile.name}</CardTitle>
                        <CardDescription className="text-base">{currentUserProfile.role}</CardDescription>
                        <div className="mt-2 text-sm text-gray-400">
                          <span>{currentUserProfile.posts} posts</span>
                          <span className="mx-2">•</span>
                          <span>Joined {currentUserProfile.joinDate}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-white font-medium mb-4">My Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-cinebuzz-dark border-none shadow">
                        <CardContent className="p-4 text-center">
                          <div className="text-3xl font-bold text-cinebuzz-accent">{currentUserProfile.posts}</div>
                          <div className="text-sm text-gray-400">Posts</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-cinebuzz-dark border-none shadow">
                        <CardContent className="p-4 text-center">
                          <div className="text-3xl font-bold text-cinebuzz-accent">0</div>
                          <div className="text-sm text-gray-400">Likes</div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // This should rarely happen since we auto-create profiles
                <Card className="bg-cinebuzz-dark-light border-none shadow">
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <p className="text-white mb-4">Creating your community profile...</p>
                      <Button 
                        className="bg-cinebuzz-accent hover:bg-cinebuzz-accent/90"
                        onClick={fetchOrCreateUserProfile}
                      >
                        Join Community
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CommunityPage; 