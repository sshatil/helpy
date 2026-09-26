import { useState } from 'react';

import { Button } from '@repo/ui/components/ui/button';
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

type CreateTaskDialogProps = {
  onCreate: (data: {
    title: string;
    duration: number;
    notes: string;
    links: string[];
  }) => void;
};

export function CreateTaskDialog({ onCreate }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('30');
  const [notes, setNotes] = useState('');
  const [links, setLinks] = useState('');

  function handleCreate() {
    const trimmedTitle = title.trim();
    const parsedDuration = Number(duration);

    if (!trimmedTitle) {
      return;
    }

    if (!Number.isFinite(parsedDuration) || parsedDuration <= 0) {
      return;
    }

    const parsedLinks = links
      .split('\n')
      .map((link) => link.trim())
      .filter(Boolean);

    onCreate({
      title: trimmedTitle,
      duration: parsedDuration,
      notes: notes.trim(),
      links: parsedLinks,
    });

    resetForm();
    setOpen(false);
  }

  function resetForm() {
    setTitle('');
    setDuration('30');
    setNotes('');
    setLinks('');
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      resetForm();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Add Task</Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Add task</DialogTitle>

          <DialogDescription>
            Add a task to this plan. You can organize and execute it later.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='task-title'>Title</Label>

            <Input
              id='task-title'
              placeholder='e.g. Read React documentation'
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='task-duration'>Duration (minutes)</Label>

            <Input
              id='task-duration'
              type='number'
              min='1'
              step='1'
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='task-notes'>Notes</Label>

            <Textarea
              id='task-notes'
              placeholder='Add notes for this task...'
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='task-links'>Links</Label>

            <Textarea
              id='task-links'
              placeholder={'Add one link per line\nhttps://example.com'}
              value={links}
              onChange={(event) => setLinks(event.target.value)}
            />

            <p className='text-muted-foreground text-xs'>
              Add one URL per line.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type='button'
            onClick={handleCreate}
            disabled={!title.trim() || !duration || Number(duration) <= 0}
          >
            Add Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
