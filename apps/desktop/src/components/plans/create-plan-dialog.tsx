import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { Button } from '@repo/ui/components/ui/button';

type CreatePlanDialogProps = {
  onCreate: (data: { title: string; description: string }) => void;
};

export function CreatePlanDialog({ onCreate }: CreatePlanDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  function handleCreate() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    onCreate({
      title: trimmedTitle,
      description: description.trim(),
    });

    setTitle('');
    setDescription('');
    setOpen(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      setTitle('');
      setDescription('');
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Create Plan</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new plan</DialogTitle>

          <DialogDescription>
            Create a plan and add tasks to it later.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='plan-title'>Title</Label>

            <Input
              id='plan-title'
              placeholder='e.g. Learn React'
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='plan-description'>Description</Label>

            <Textarea
              id='plan-description'
              placeholder='What do you want to accomplish?'
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type='button' onClick={handleCreate} disabled={!title.trim()}>
            Create Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
