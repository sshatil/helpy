import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/ui/components/ui/avatar';
import { Card, CardContent } from '@repo/ui/components/ui/card';

type PublicProfile = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  bio?: string | null;
};

type CommunityProfileResultProps = {
  profile: PublicProfile;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return 'HU';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function CommunityProfileResult({
  profile,
}: CommunityProfileResultProps) {
  const initials = getInitials(profile.displayName || profile.username);

  return (
    <Card className='hover:bg-accent/50 transition-colors'>
      <CardContent className='flex items-center gap-4 p-4'>
        <Avatar className='size-12 shrink-0'>
          <AvatarImage
            src={profile.avatarUrl ?? undefined}
            alt={profile.displayName}
          />

          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className='min-w-0 flex-1'>
          <p className='truncate font-medium'>{profile.displayName}</p>

          <p className='text-muted-foreground truncate text-sm'>
            @{profile.username}
          </p>

          {profile.bio ? (
            <p className='text-muted-foreground mt-1 truncate text-sm'>
              {profile.bio}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
