import { Search } from 'lucide-react';

import { Card, CardContent } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';

type CommunitySearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function CommunitySearch({ value, onChange }: CommunitySearchProps) {
  return (
    <Card>
      <CardContent className='p-6'>
        <div className='relative'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />

          <Input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder='Search by username or name...'
            className='pl-9'
            aria-label='Search public profiles'
          />
        </div>

        <p className='text-muted-foreground mt-2 text-xs'>
          Enter at least 2 characters to search public profiles.
        </p>
      </CardContent>
    </Card>
  );
}
