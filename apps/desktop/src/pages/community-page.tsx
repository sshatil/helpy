import { ArrowLeft, Users } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { Skeleton } from '@repo/ui/components/ui/skeleton';

import { CommunitySearch } from '../components/community/community-search';
import { CommunityProfileResult } from '../components/community/community-profile-result';
import { useDebounce } from '../hooks/use-debounce';
import { usePublicProfileSearch } from '../hooks/use-public-profile-search';

function SearchResultsSkeleton() {
  return (
    <div className='space-y-3'>
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <CardContent className='flex items-center gap-4 p-4'>
            <Skeleton className='size-12 shrink-0 rounded-full' />

            <div className='min-w-0 flex-1 space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-3 w-24' />
              <Skeleton className='h-3 w-48 max-w-full' />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className='text-muted-foreground flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center'>
      <Users className='mb-3 size-8' />

      <h2 className='text-foreground font-medium'>Find people</h2>

      <p className='mt-1 max-w-sm text-sm'>
        Search for a username or display name to discover public Helpy profiles.
      </p>
    </div>
  );
}

function NoResults() {
  return (
    <div className='text-muted-foreground flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center'>
      <Users className='mb-3 size-8' />

      <h2 className='text-foreground font-medium'>No profiles found</h2>

      <p className='mt-1 text-sm'>Try another username or display name.</p>
    </div>
  );
}

function SearchError() {
  return (
    <div className='border-destructive/30 rounded-lg border p-6 text-center'>
      <h2 className='font-medium'>Search failed</h2>

      <p className='text-muted-foreground mt-1 text-sm'>
        We couldn't load public profiles. Please try again.
      </p>
    </div>
  );
}

export function CommunityPage() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const {
    data: profiles = [],
    isLoading,
    isFetching,
    isError,
  } = usePublicProfileSearch(debouncedSearchQuery);

  const hasSearch = debouncedSearchQuery.trim().length >= 2;

  const isSearching = hasSearch && (isLoading || isFetching);

  const showResults =
    hasSearch && !isSearching && !isError && profiles.length > 0;

  const showNoResults =
    hasSearch && !isSearching && !isError && profiles.length === 0;

  return (
    <div className='mx-auto w-full max-w-4xl space-y-8'>
      {/* Header */}
      <div className='flex items-center gap-3'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => navigate(-1)}
          aria-label='Go back'
        >
          <ArrowLeft className='size-4' />
        </Button>

        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Community</h1>

          <p className='text-muted-foreground mt-1 text-sm'>
            Find people and explore their public productivity profiles.
          </p>
        </div>
      </div>

      {/* Search */}
      <CommunitySearch value={searchQuery} onChange={setSearchQuery} />

      {/* Initial state */}
      {!hasSearch && <EmptyState />}

      {/* Loading */}
      {isSearching && <SearchResultsSkeleton />}

      {/* Error */}
      {isError && !isSearching && <SearchError />}

      {/* No results */}
      {showNoResults && <NoResults />}

      {/* Results */}
      {showResults && (
        <section className='space-y-3'>
          <div className='flex items-center justify-between'>
            <h2 className='text-sm font-medium'>Public profiles</h2>

            <span className='text-muted-foreground text-xs'>
              {profiles.length} result
              {profiles.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className='space-y-3'>
            {profiles.map((profile) => (
              <Link
                key={profile.id}
                to={`/helpy/${profile.username}`}
                className='block'
              >
                <CommunityProfileResult profile={profile} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
