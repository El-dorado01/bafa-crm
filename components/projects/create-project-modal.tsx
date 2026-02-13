'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';
import { createProject } from '@/app/actions/projects';
import { toast } from 'sonner';

interface CreateProjectModalProps {
  clients: { id: string; name: string | null; email: string }[];
  consultants: { id: string; name: string | null; email: string }[];
  statuses: { id: string; name: string }[];
}

export function CreateProjectModal({
  clients,
  consultants,
  statuses,
}: CreateProjectModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    clientId: '',
    consultantId: '',
    caseStatusId: statuses[0]?.id || '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.clientId || !formData.caseStatusId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    const result = await createProject({
      ...formData,
      consultantId: formData.consultantId || null,
    });

    if (result.success) {
      toast.success('Project created successfully');
      setOpen(false);
      setFormData({
        name: '',
        clientId: '',
        consultantId: '',
        caseStatusId: statuses[0]?.id || '',
      });
    } else {
      toast.error(result.error || 'Failed to create project');
    }
    setLoading(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button className='rounded-xl font-bold gap-2 px-5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-none'>
          <Plus className='h-5 w-5' />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] rounded-3xl p-0 overflow-hidden flex flex-col max-h-[85vh]'>
        <DialogHeader className='p-6 pb-2'>
          <DialogTitle className='text-2xl font-black italic tracking-tight'>
            Start <span className='text-primary'>New Project</span>
          </DialogTitle>
          <DialogDescription className='font-medium text-muted-foreground'>
            Initialize a new funding case by assigning a client and consultant.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col flex-1 overflow-hidden'
        >
          <div className='flex-1 overflow-y-auto px-6 py-4 space-y-4'>
            <div className='space-y-2'>
              <Label
                htmlFor='name'
                className='font-bold ml-1'
              >
                Project Name
              </Label>
              <Input
                id='name'
                placeholder='e.g. Acme Funding 2024'
                className='rounded-xl border-border/40 font-bold h-12 bg-muted/20'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className='space-y-2'>
              <Label className='font-bold ml-1'>Assign Client</Label>
              <Select
                value={formData.clientId}
                onValueChange={(val) =>
                  setFormData({ ...formData, clientId: val })
                }
              >
                <SelectTrigger
                  size='lg'
                  className='w-full rounded-xl border-border/40 font-bold h-12 bg-muted/20 px-4'
                >
                  <div className='truncate flex-1 text-left'>
                    <SelectValue placeholder='Select a client' />
                  </div>
                </SelectTrigger>
                <SelectContent className='rounded-xl font-bold max-w-[calc(100vw-2rem)] sm:max-w-[375px]'>
                  {clients.map((client) => (
                    <SelectItem
                      className='h-12 px-6'
                      key={client.id}
                      value={client.id}
                    >
                      <span className='truncate block'>
                        {client.name || client.email}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label className='font-bold ml-1'>
                Assign Consultant (Optional)
              </Label>
              <Select
                value={formData.consultantId}
                onValueChange={(val) =>
                  setFormData({ ...formData, consultantId: val })
                }
              >
                <SelectTrigger
                  size='lg'
                  className='w-full rounded-xl border-border/40 font-bold h-12 bg-muted/20'
                >
                  <SelectValue placeholder='Select a consultant' />
                </SelectTrigger>
                <SelectContent className='rounded-xl font-bold'>
                  <SelectItem
                    className='h-12 px-6'
                    value='none'
                  >
                    Unassigned
                  </SelectItem>
                  {consultants.map((consultant) => (
                    <SelectItem
                      className='h-12 px-6'
                      key={consultant.id}
                      value={consultant.id}
                    >
                      {consultant.name || consultant.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label className='font-bold ml-1'>Initial Status</Label>
              <Select
                value={formData.caseStatusId}
                onValueChange={(val) =>
                  setFormData({ ...formData, caseStatusId: val })
                }
              >
                <SelectTrigger
                  size='lg'
                  className='w-full rounded-xl border-border/40 font-bold h-12 bg-muted/20'
                >
                  <SelectValue placeholder='Initial stage' />
                </SelectTrigger>
                <SelectContent className='rounded-xl font-bold'>
                  {statuses.map((status) => (
                    <SelectItem
                      className='h-12 px-6'
                      key={status.id}
                      value={status.id}
                    >
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className='p-6 pt-4 border-t border-border/10 bg-muted/5 sm:justify-end'>
            <Button
              type='submit'
              disabled={loading}
              className='rounded-xl font-black bg-primary px-8 h-12 shadow-lg shadow-primary/20 hover:scale-105 transition-all w-full md:w-auto'
            >
              {loading ? (
                <Loader2 className='h-5 w-5 animate-spin' />
              ) : (
                'Create Project'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
