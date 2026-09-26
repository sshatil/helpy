import { useEffect, useState } from 'react';

import type { Plan } from '../../lib/plans/types';

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

type EditPlanDialogProps = {
  plan: Plan;
  onUpdate: (id: string, data: Pick<Plan, 'title' | 'description'>) => void;
};

export function EditPlanDialog({ plan, onUpdate }: EditPlanDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(plan.title);
  const [description, setDescription] = useState(plan.description ?? '');

  useEffect(() => {
    if (open) {
      setTitle(plan.title);
      setDescription(plan.description ?? '');
    }
  }, [open, plan]);

  function handleUpdate() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    onUpdate(plan.id, {
      title: trimmedTitle,
      description: description.trim(),
    });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Edit Plan</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit plan</DialogTitle>

          <DialogDescription>
            Update the title and description of this plan.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='edit-plan-title'>Title</Label>

            <Input
              id='edit-plan-title'
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='edit-plan-description'>Description</Label>

            <Textarea
              id='edit-plan-description'
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleUpdate} disabled={!title.trim()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
