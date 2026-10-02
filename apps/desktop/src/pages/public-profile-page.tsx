import { ArrowLeft, CalendarDays, RefreshCw } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { Button } from '@repo/ui/components/ui/button';

import { usePublicProfile } from '../hooks/use-public-profile';

import { PublicProfileHeader } from '../components/public-profile/public-profile-header';
import { PublicProfileStatistics } from '../components/public-profile/public-profile-statistics';
import { PublicProfileActivity } from '../components/public-profile/public-profile-activity';

function ProfileLoading() {
  return (
    <div className='mx-auto w-full max-w-5xl space-y-6 p-6'>
      <div className='h-8'>
        <div className='bg-muted h-8 w-24 animate-pulse rounded-md' />
      </div>

      <div className='flex flex-col items-center py-6 text-center'>
        <div className='bg-muted size-24 animate-pulse rounded-full' />

        <div className='bg-muted mt-5 h-7 w-44 animate-pulse rounded-md' />

        <div className='bg-muted mt-3 h-4 w-28 animate-pulse rounded-md' />

        <div className='bg-muted mt-5 h-4 w-80 max-w-full animate-pulse rounded-md' />
      </div>

      <div className='overflow-hidden rounded-xl border'>
        <div className='grid grid-cols-2 sm:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className='flex items-center gap-3 px-5 py-5'>
              <div className='bg-muted size-9 animate-pulse rounded-lg' />

              <div className='space-y-2'>
                <div className='bg-muted h-5 w-14 animate-pulse rounded' />

                <div className='bg-muted h-3 w-20 animate-pulse rounded' />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className='p-6'>
          <div className='bg-muted h-5 w-24 animate-pulse rounded' />

          <div className='bg-muted mt-5 h-32 animate-pulse rounded-md' />
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileError({
  error,
  onRetry,
  isFetching,
}: {
  error: unknown;
  onRetry: () => void;
  isFetching: boolean;
}) {
  return (
    <div className='mx-auto w-full max-w-3xl p-6'>
      <Card>
        <CardHeader>
          <CardTitle>Profile not found</CardTitle>

          <CardDescription>
            This profile does not exist or is not publicly available.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className='text-muted-foreground text-sm'>
            {error instanceof Error
              ? error.message
              : 'Unable to load this profile.'}
          </p>

          <div className='mt-6 flex flex-wrap items-center gap-3'>
            <Button asChild variant='outline'>
              <Link to='/dashboard'>
                <ArrowLeft className='size-4' />
                Back to dashboard
              </Link>
            </Button>

            <Button type='button' onClick={onRetry} disabled={isFetching}>
              <RefreshCw
                className={['size-4', isFetching ? 'animate-spin' : ''].join(
                  ' ',
                )}
              />
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PublicProfilePage() {
  const { username } = useParams<{
    username: string;
  }>();

  const { data, isLoading, isError, error, refetch, isFetching } =
    usePublicProfile(username);

  if (isLoading) {
    return <ProfileLoading />;
  }

  if (isError || !data) {
    return (
      <ProfileError
        error={error}
        onRetry={() => void refetch()}
        isFetching={isFetching}
      />
    );
  }

  const { profile, statistics, activity } = data;

  return (
    <div className='mx-auto w-full max-w-5xl space-y-6 p-6'>
      {/* Navigation */}
      <div className='flex items-center justify-between'>
        <Button asChild variant='ghost' size='sm'>
          <Link to='/dashboard'>
            <ArrowLeft className='size-4' />
            Dashboard
          </Link>
        </Button>

        {isFetching ? (
          <RefreshCw className='text-muted-foreground size-4 animate-spin' />
        ) : null}
      </div>

      {/* Profile */}
      <PublicProfileHeader
        displayName={profile.displayName}
        username={profile.username}
        avatarUrl={profile.avatarUrl}
        bio={profile.bio}
      />

      {/* Statistics */}
      <PublicProfileStatistics
        completedTasks={statistics.completedTasks}
        totalFocusMinutes={statistics.totalFocusMinutes}
        activeDays={statistics.activeDays}
        plansCreated={statistics.plansCreated}
      />

      {/* Activity */}
      <PublicProfileActivity activity={activity} />

      {/* Footer information */}
      <div className='text-muted-foreground flex items-center justify-center gap-2 py-2 text-xs'>
        <CalendarDays className='size-3.5' />
        Activity is based on completed tasks.
      </div>
    </div>
  );
}
