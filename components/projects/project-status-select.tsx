'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateProjectStatus } from '@/app/actions/projects';
import { toast } from 'sonner';

interface Status {
  id: string;
  name: string;
}

interface ProjectStatusSelectProps {
  projectId: string;
  currentStatusId: string;
  statuses: Status[];
}

export function ProjectStatusSelect({
  projectId,
  currentStatusId,
  statuses,
}: ProjectStatusSelectProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusId, setStatusId] = useState(currentStatusId);

  async function handleStatusChange(newStatusId: string) {
    setIsUpdating(true);
    const result = await updateProjectStatus(projectId, newStatusId);

    if (result.success) {
      setStatusId(newStatusId);
      toast.success('Status updated successfully');
    } else {
      toast.error('Failed to update status');
    }
    setIsUpdating(false);
  }

  return (
    <Select
      disabled={isUpdating}
      value={statusId}
      onValueChange={handleStatusChange}
    >
      <SelectTrigger className='w-[180px] font-bold border-border/40 rounded-xl bg-white shadow-sm hover:border-primary/40 transition-all'>
        <SelectValue placeholder='Set status' />
      </SelectTrigger>
      <SelectContent className='rounded-xl border-border/40 shadow-xl bg-white/90 backdrop-blur-xl'>
        {statuses.map((status) => (
          <SelectItem
            key={status.id}
            value={status.id}
            className='font-bold cursor-pointer rounded-lg focus:bg-primary/10 focus:text-primary'
          >
            {status.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
