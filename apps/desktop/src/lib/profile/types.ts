export type Profile = {
  id: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProfileInput = {
  displayName: string;
  username: string;
  bio: string;
};
