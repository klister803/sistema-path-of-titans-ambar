export type Tables = {
  users: {
    id: string;
    username: string;
    email: string;
    discord_id?: string;
    discord_username?: string;
    discord_avatar_url?: string;
    created_at: string;
    last_login: string;
    status: 'active' | 'banned' | 'suspended';
    avatar_url?: string;
    gender?: string;
    favorite_dinosaur?: string;
    discord_links?: Record<string, string>;
  };
  
  images: {
    id: string;
    category: 'avatar' | 'dinosaur' | 'environment';
    url: string;
    description: string;
    uploaded_at: string;
  };
  user_galleries: {
    id: string;
    user_id: string;
    image_url: string;
    description?: string;
    uploaded_at: string;
  };
  gallery_reactions: {
    id: string;
    gallery_id: string;
    user_id: string;
    reaction_type: 'like' | 'dislike';
    created_at: string;
  };
  gallery_comments: {
    id: string;
    gallery_id: string;
    user_id: string;
    comment: string;
    created_at: string;
  };
};
