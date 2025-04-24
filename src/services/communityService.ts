import { getToken } from './authService';

const POSTS_STORAGE_KEY = 'cinebuzz_community_posts';
const MEMBERS_STORAGE_KEY = 'cinebuzz_community_members';

export interface CommunityPost {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  liked: boolean;
}

export interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  posts: number;
  joinDate: string;
}

// Empty default arrays instead of mock data
const defaultPosts: CommunityPost[] = [];
const defaultMembers: CommunityMember[] = [];

// Helper functions for localStorage
const getStoredPosts = (): CommunityPost[] => {
  try {
    const postsJson = localStorage.getItem(POSTS_STORAGE_KEY);
    if (postsJson) {
      return JSON.parse(postsJson);
    }
  } catch (error) {
    console.error('Error reading posts from localStorage:', error);
  }
  return defaultPosts;
};

const getStoredMembers = (): CommunityMember[] => {
  try {
    const membersJson = localStorage.getItem(MEMBERS_STORAGE_KEY);
    if (membersJson) {
      return JSON.parse(membersJson);
    }
  } catch (error) {
    console.error('Error reading members from localStorage:', error);
  }
  return defaultMembers;
};

const savePosts = (posts: CommunityPost[]) => {
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
};

const saveMembers = (members: CommunityMember[]) => {
  localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));
};

// Initialize empty arrays if not present
if (!localStorage.getItem(POSTS_STORAGE_KEY)) {
  savePosts(defaultPosts);
}

if (!localStorage.getItem(MEMBERS_STORAGE_KEY)) {
  saveMembers(defaultMembers);
}

// Community service functions
export const getCommunityPosts = async (): Promise<CommunityPost[]> => {
  return getStoredPosts();
};

export const addCommunityPost = async (post: Omit<CommunityPost, 'id' | 'timestamp' | 'likes' | 'comments' | 'liked'>): Promise<CommunityPost> => {
  const posts = getStoredPosts();
  
  const newPost: CommunityPost = {
    id: `post-${Date.now()}`,
    ...post,
    likes: 0,
    comments: 0,
    timestamp: "Just now",
    liked: false
  };
  
  const updatedPosts = [newPost, ...posts];
  savePosts(updatedPosts);
  
  // Update the post count for the user
  updateMemberPostCount(post.user.id);
  
  return newPost;
};

export const togglePostLike = async (postId: string): Promise<CommunityPost | null> => {
  const posts = getStoredPosts();
  let updatedPost = null;
  
  const updatedPosts = posts.map(post => {
    if (post.id === postId) {
      updatedPost = {
        ...post,
        liked: !post.liked,
        likes: post.liked ? post.likes - 1 : post.likes + 1
      };
      return updatedPost;
    }
    return post;
  });
  
  savePosts(updatedPosts);
  return updatedPost;
};

export const getCommunityMembers = async (): Promise<CommunityMember[]> => {
  return getStoredMembers();
};

export const getMemberById = async (memberId: string): Promise<CommunityMember | null> => {
  const members = getStoredMembers();
  return members.find(member => member.id === memberId) || null;
};

export const updateMemberPostCount = (memberId: string): void => {
  const members = getStoredMembers();
  
  const updatedMembers = members.map(member => {
    if (member.id === memberId) {
      return {
        ...member,
        posts: member.posts + 1
      };
    }
    return member;
  });
  
  saveMembers(updatedMembers);
};

// New function to create member profile if doesn't exist
export const createMemberIfNotExists = async (userData: { id: string, name: string, profileImage?: string }): Promise<CommunityMember> => {
  const members = getStoredMembers();
  const existingMember = members.find(member => member.id === userData.id);
  
  if (existingMember) {
    return existingMember;
  }
  
  const newMember: CommunityMember = {
    id: userData.id,
    name: userData.name,
    avatar: userData.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
    role: "Member",
    posts: 0,
    joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  };
  
  const updatedMembers = [...members, newMember];
  saveMembers(updatedMembers);
  
  return newMember;
}; 