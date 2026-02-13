'use client';

import { useState, useRef } from 'react';
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
import { Input } from '@/components/ui/input';
import { uploadDocument } from '@/app/actions/documents';
import { toast } from 'sonner';
import { Upload, Loader2, FileText, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface DocumentType {
  id: string;
  name: string;
}

interface UploadDocumentModalProps {
  projectId: string;
  userId: string;
  documentTypes: DocumentType[];
}

export function UploadDocumentModal({
  projectId,
  userId,
  documentTypes,
}: UploadDocumentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit() {
    if (!selectedType || !file) {
      toast.error('Please select a document type and a file');
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${projectId}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // 2. Record in Database
      const result = await uploadDocument(
        projectId,
        selectedType,
        file.name,
        data.path,
        userId,
      );

      if (result.success) {
        toast.success('Document uploaded successfully');
        setIsOpen(false);
        setSelectedType('');
        setFile(null);
      } else {
        // Atomic Cleanup: If DB update fails, delete the file from storage
        console.warn('DB update failed, cleaning up storage...');
        await supabase.storage.from('documents').remove([data.path]);
        toast.error(result.error || 'Failed to sync document to database');
      }
    } catch (error: any) {
      console.error('Upload process failed:', error);
      toast.error(
        error.message || 'An unexpected error occurred during upload',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <Button className='rounded-lg font-black py-6 px-6 shadow-sm shadow-primary/20 gap-2 hover:scale-102 transition-all cursor-pointer bg-primary text-primary-foreground'>
          <Upload className='h-5 w-5' />
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className='rounded-2xl border-border/40 shadow-2xl bg-white sm:max-w-[450px] p-0 overflow-hidden flex flex-col max-h-[85vh]'>
        <DialogHeader className='p-6 pb-2'>
          <DialogTitle className='text-2xl font-black tracking-tight'>
            Upload Document
          </DialogTitle>
          <DialogDescription className='font-medium text-muted-foreground'>
            Select the document type and choose a file to upload to Supabase.
          </DialogDescription>
        </DialogHeader>
        <div className='flex-1 overflow-y-auto px-6 py-4 space-y-6'>
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

          <div className='grid gap-2'>
            <Label className='font-bold text-sm ml-1'>File Selection</Label>
            <Input
              type='file'
              className='hidden'
              ref={fileInputRef}
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) setFile(selectedFile);
              }}
              accept='.pdf,.doc,.docx,.jpg,.jpeg,.png'
            />

            {!file ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className='bg-primary/5 rounded-2xl p-8 border border-primary/10 flex flex-col items-center justify-center gap-3 border-dashed hover:bg-primary/10 transition-all cursor-pointer group'
              >
                <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform'>
                  <Upload className='h-6 w-6 text-primary' />
                </div>
                <div className='text-center'>
                  <p className='text-xs font-bold text-primary uppercase tracking-widest'>
                    Choose a file
                  </p>
                  <p className='text-[10px] text-muted-foreground mt-1'>
                    PDF, DOCX, PNG, JPG (Max 50MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className='relative bg-muted/20 border border-border/40 rounded-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 w-full max-w-full'>
                <div className='h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0'>
                  <FileText className='h-6 w-6' />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-0.5 w-full'>
                    <p className='text-sm font-bold truncate text-foreground'>
                      {file.name.split('.').slice(0, -1).join('.') || file.name}
                    </p>
                    {file.name.includes('.') && (
                      <p className='text-sm font-bold shrink-0 text-foreground'>
                        .{file.name.split('.').pop()}
                      </p>
                    )}
                  </div>
                  <p className='text-[10px] text-muted-foreground uppercase font-black tracking-tight truncate'>
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className='absolute top-2 right-2 h-6 w-6 rounded-full hover:bg-muted flex items-center justify-center transition-colors shrink-0'
                >
                  <X className='h-4 w-4 text-muted-foreground' />
                </button>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className='p-6 pt-4 border-t border-border/10 bg-muted/5 sm:justify-end'>
          <Button
            className='w-full rounded-xl font-black h-12 gap-2 shadow-lg shadow-primary/10'
            onClick={handleSubmit}
            disabled={isSubmitting || !file || !selectedType}
          >
            {isSubmitting ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Uploading...
              </>
            ) : (
              <>
                <Upload className='h-4 w-4' />
                Confirm & Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
