import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/ui/components/ui/avatar';

type ProfileHeaderProps = {
  displayName: string;
  username: string;
  email?: string;
  avatarUrl?: string | null;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return 'HU';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function ProfileHeader({
  displayName,
  username,
  email,
  avatarUrl,
}: ProfileHeaderProps) {
  const initials = getInitials(displayName || email || 'Helpy User');

  return (
    <div className='flex items-center gap-4'>
      <Avatar className='size-20'>
        <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />

        <AvatarFallback className='text-lg'>{initials}</AvatarFallback>
      </Avatar>

      <div className='min-w-0'>
        <p className='text-base font-medium'>{displayName}</p>

        {username ? (
          <p className='text-muted-foreground text-sm'>@{username}</p>
        ) : null}

        {email ? (
          <p className='text-muted-foreground mt-1 truncate text-sm'>{email}</p>
        ) : null}
      </div>
    </div>
  );
}
