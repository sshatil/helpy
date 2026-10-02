import { useEffect, useState } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Textarea } from '@repo/ui/components/ui/textarea';

type ProfileFormProps = {
  displayName: string;
  username: string;
  bio?: string | null;
  isPending: boolean;
  isError: boolean;
  error: unknown;
  isSuccess: boolean;
  onSubmit: (data: {
    displayName: string;
    username: string;
    bio: string;
  }) => void;
  onCancel: () => void;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}

export function ProfileForm({
  displayName: initialDisplayName,
  username: initialUsername,
  bio: initialBio,
  isPending,
  isError,
  error,
  isSuccess,
  onSubmit,
  onCancel,
}: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [username, setUsername] = useState(initialUsername);
  const [bio, setBio] = useState(initialBio ?? '');

  useEffect(() => {
    setDisplayName(initialDisplayName);
    setUsername(initialUsername);
    setBio(initialBio ?? '');
  }, [initialDisplayName, initialUsername, initialBio]);

  const hasChanges =
    displayName !== initialDisplayName ||
    username !== initialUsername ||
    bio !== (initialBio ?? '');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      displayName,
      username,
      bio,
    });
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-2'>
        <Label htmlFor='display-name'>Display name</Label>

        <Input
          id='display-name'
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder='Your display name'
          maxLength={100}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='username'>Username</Label>

        <Input
          id='username'
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder='your_username'
          maxLength={30}
        />

        <p className='text-muted-foreground text-xs'>
          3–30 characters. Letters, numbers, and underscores only.
        </p>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='bio'>Bio</Label>

        <Textarea
          id='bio'
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          placeholder='Tell us a little about yourself...'
          maxLength={500}
          rows={4}
        />

        <p className='text-muted-foreground text-xs'>{bio.length}/500</p>
      </div>

      {isError ? (
        <p className='text-destructive text-sm'>{getErrorMessage(error)}</p>
      ) : null}

      {isSuccess ? (
        <p className='text-sm text-green-600 dark:text-green-400'>
          Profile updated successfully.
        </p>
      ) : null}

      <div className='flex justify-end gap-2'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancel
        </Button>

        <Button type='submit' disabled={!hasChanges || isPending}>
          {isPending ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
