import { useEffect, useState } from 'react';

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
import { Task } from '../../lib/plans/types';

type EditTaskDialogProps = {
  task: Task;
  onUpdate: (
    id: string,
    data: Partial<Pick<Task, 'title' | 'duration' | 'notes' | 'links'>>,
  ) => void;
};

export function EditTaskDialog({ task, onUpdate }: EditTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [duration, setDuration] = useState(String(task.duration));
  const [notes, setNotes] = useState(task.notes ?? '');
  const [links, setLinks] = useState(task.links.join('\n'));

  useEffect(() => {
    if (open) {
      setTitle(task.title);
      setDuration(String(task.duration));
      setNotes(task.notes ?? '');
      setLinks(task.links.join('\n'));
    }
  }, [open, task]);

  function handleUpdate() {
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

    onUpdate(task.id, {
      title: trimmedTitle,
      duration: parsedDuration,
      notes: notes.trim(),
      links: parsedLinks,
    });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='sm' variant='outline'>
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>

          <DialogDescription>
            Update the details of this task.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='edit-task-title'>Title</Label>

            <Input
              id='edit-task-title'
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='edit-task-duration'>Duration (minutes)</Label>

            <Input
              id='edit-task-duration'
              type='number'
              min='1'
              step='1'
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='edit-task-notes'>Notes</Label>

            <Textarea
              id='edit-task-notes'
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='edit-task-links'>Links</Label>

            <Textarea
              id='edit-task-links'
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
            onClick={handleUpdate}
            disabled={!title.trim() || !duration || Number(duration) <= 0}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
