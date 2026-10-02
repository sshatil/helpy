import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/ui/components/ui/avatar';

type PublicProfileHeaderProps = {
  displayName: string;
  username: string;
  avatarUrl?: string | null;
  bio?: string | null;
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

export function PublicProfileHeader({
  displayName,
  username,
  avatarUrl,
  bio,
}: PublicProfileHeaderProps) {
  const initials = getInitials(displayName);

  return (
    <div className='flex flex-col items-center text-center'>
      <Avatar className='border-background size-24 border-4 shadow-sm'>
        <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />

        <AvatarFallback className='text-xl font-medium'>
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className='mt-5'>
        <h1 className='text-2xl font-semibold tracking-tight'>{displayName}</h1>

        <p className='text-muted-foreground mt-1 text-sm'>@{username}</p>
      </div>

      {bio ? (
        <p className='text-muted-foreground mt-4 max-w-2xl text-sm leading-6'>
          {bio}
        </p>
      ) : null}
    </div>
  );
}
