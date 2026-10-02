export type PublicProfile = {
  id: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
};

export type PublicProfileStatistics = {
  completedTasks: number;
  totalFocusMinutes: number;
  activeDays: number;
  plansCreated: number;
};

export type PublicProfileActivity = {
  date: string;
  count: number;
  minutes: number;
};

export type PublicProfileData = {
  profile: PublicProfile;
  statistics: PublicProfileStatistics;
  activity: PublicProfileActivity[];
};
