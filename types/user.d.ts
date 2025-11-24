export interface UserProfile {
  id: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  social?: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  profile?: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}