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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { requestDocument } from '@/app/actions/documents';
import { toast } from 'sonner';
import { PlusCircle, Loader2 } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  clientId: string;
}

interface DocumentType {
  id: string;
  name: string;
}

interface RequestDocumentModalProps {
  projects: Project[];
  documentTypes: DocumentType[];
}

export function RequestDocumentModal({
  projects,
  documentTypes,
}: RequestDocumentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');

  async function handleSubmit() {
    if (!selectedProject || !selectedType) {
      toast.error('Please select both a project and a document type');
      return;
    }

    const project = projects.find((p) => p.id === selectedProject);
    if (!project) return;

    setIsSubmitting(true);
    const result = await requestDocument(
      selectedProject,
      selectedType,
      project.clientId,
    );

    if (result.success) {
      toast.success('Document request created');
      setIsOpen(false);
      setSelectedProject('');
      setSelectedType('');
    } else {
      toast.error(result.error || 'Failed to request document');
    }
    setIsSubmitting(false);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <Button className='rounded-lg font-black py-6 px-6 shadow-sm shadow-primary/20 gap-2 hover:scale-102 transition-all cursor-pointer'>
          <PlusCircle className='h-5 w-5' />
          Request New Document
        </Button>
      </DialogTrigger>
      <DialogContent className='rounded-2xl border-border/40 shadow-2xl bg-white sm:max-w-[450px] p-0 overflow-hidden flex flex-col max-h-[85vh]'>
        <DialogHeader className='p-6 pb-2'>
          <DialogTitle className='text-2xl font-black tracking-tight'>
            Request Document
          </DialogTitle>
          <DialogDescription className='font-medium text-muted-foreground'>
            Select the project and the type of document you need from the
            client.
          </DialogDescription>
        </DialogHeader>
        <div className='flex-1 overflow-y-auto px-6 py-4 space-y-6'>
          <div className='grid gap-2'>
            <Label
              htmlFor='project'
              className='font-bold text-sm ml-1'
            >
              Target Project
            </Label>
            <Select
              value={selectedProject}
              onValueChange={setSelectedProject}
            >
              <SelectTrigger
                size='lg'
                className='w-full rounded-xl border-border/40 font-bold h-12 bg-muted/20 px-4'
              >
                <div className='truncate flex-1 text-left'>
                  <SelectValue placeholder='Select a project' />
                </div>
              </SelectTrigger>
              <SelectContent className='rounded-xl border-border/40 shadow-xl max-w-[calc(100vw-2rem)] sm:max-w-[400px]'>
                {projects.map((p) => (
                  <SelectItem
                    key={p.id}
                    value={p.id}
                    className='font-bold py-3'
                  >
                    <span className='truncate block'>{p.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='grid gap-2'>
            <Label
              htmlFor='type'
              className='font-bold text-sm ml-1'
            >
              Document Type
            </Label>
            <Select
              value={selectedType}
              onValueChange={setSelectedType}
            >
              <SelectTrigger
                size='lg'
                className='w-full rounded-xl border-border/40 font-bold h-12 bg-muted/20'
              >
                <SelectValue placeholder='Select document type' />
              </SelectTrigger>
              <SelectContent className='rounded-xl border-border/40 shadow-xl max-h-[200px]'>
                {documentTypes.map((t) => (
                  <SelectItem
                    key={t.id}
                    value={t.id}
                    className='font-bold p-3'
                  >
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className='p-6 pt-4 border-t border-border/10 bg-muted/5 sm:justify-end'>
          <Button
            className='w-full rounded-xl font-black h-12'
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Creating Request...
              </>
            ) : (
              'Create Request'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
