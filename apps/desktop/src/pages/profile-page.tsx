import { useNavigate } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { Separator } from '@repo/ui/components/ui/separator';

import { useProfile, useUpdateProfile } from '../hooks/use-profile';
import { useAuth } from '../lib/auth/auth-context';

import { ProfileForm } from '../components/profile/profile-form';
import { ProfileHeader } from '../components/profile/profile-header';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}

export default function ProfilePage() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const { data: profile, isLoading, isError, error } = useProfile();

  const updateProfile = useUpdateProfile();

  function handleUpdateProfile(data: {
    displayName: string;
    username: string;
    bio: string;
  }) {
    updateProfile.mutate(data);
  }

  if (isLoading) {
    return (
      <div className='flex min-h-[calc(100vh-4rem)] items-center justify-center'>
        <p className='text-muted-foreground text-sm'>Loading profile...</p>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className='mx-auto w-full max-w-3xl p-6'>
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>

            <CardDescription>We could not load your profile.</CardDescription>
          </CardHeader>

          <CardContent>
            <p className='text-destructive text-sm'>{getErrorMessage(error)}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='mx-auto w-full max-w-3xl p-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-semibold tracking-tight'>Profile</h1>

        <p className='text-muted-foreground mt-1 text-sm'>
          Manage your Helpy profile information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>

          <CardDescription>
            Your profile information is private to your account for now.
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-8'>
          <ProfileHeader
            displayName={profile.displayName}
            username={profile.username}
            email={user?.email}
            avatarUrl={profile.avatarUrl}
          />

          <Separator />

          <ProfileForm
            displayName={profile.displayName}
            username={profile.username}
            bio={profile.bio}
            isPending={updateProfile.isPending}
            isError={updateProfile.isError}
            error={updateProfile.error}
            isSuccess={updateProfile.isSuccess}
            onSubmit={handleUpdateProfile}
            onCancel={() => navigate(-1)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
