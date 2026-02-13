'use client';

import { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FilePlus2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Upload,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  fulfillDocumentRequest,
  uploadDocument,
} from '@/app/actions/documents';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface DocType {
  id: string;
  name: string;
}

interface Doc {
  id: string;
  type: { name: string };
  state: { name: string };
}

interface Project {
  id: string;
  name: string;
}

interface UploadCenterProps {
  documentTypes: DocType[];
  existingDocuments: Doc[];
  projects: Project[];
  userId: string;
}

export function UploadCenter({
  documentTypes,
  existingDocuments,
  projects,
  userId,
}: UploadCenterProps) {
  const [selectedProjectId, setSelectedProjectId] = useState(
    projects[0]?.id || '',
  );
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTypeId, setActiveTypeId] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeTypeId || !selectedProjectId) return;

    setIsUploading(activeTypeId);
    const supabase = createClient();

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${selectedProjectId}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw new Error(uploadError.message);

      const result = await uploadDocument(
        selectedProjectId,
        activeTypeId,
        file.name,
        data.path,
        userId,
      );

      if (result.success) {
        toast.success(`Document uploaded successfully`);
      } else {
        // Atomic Cleanup: If DB update fails, delete the file from storage
        console.warn('DB update failed, cleaning up storage...');
        await supabase.storage.from('documents').remove([data.path]);
        toast.error(`Failed to record upload in database`);
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error(error.message || 'Failed to upload document');
    } finally {
      setIsUploading(null);
      setActiveTypeId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerUpload = (typeId: string) => {
    if (!selectedProjectId) {
      toast.error('Please select a project first');
      return;
    }
    setActiveTypeId(typeId);
    fileInputRef.current?.click();
  };

  const getDocStatus = (typeName: string) => {
    const doc = existingDocuments.find((d) => d.type.name === typeName);
    if (!doc) return 'none';
    return doc.state.name;
  };

  return (
    <Card className='border-none shadow-xl bg-linear-to-br from-primary/5 via-background to-blue-500/5 overflow-hidden ring-1 ring-primary/10'>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileSelect}
        className='hidden'
        accept='.pdf,.doc,.docx,.jpg,.jpeg,.png'
      />
      <CardHeader className='pb-6 bg-white/40 backdrop-blur-md border-b border-primary/5'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
          <div className='space-y-1'>
            <div className='flex items-center gap-2'>
              <div className='h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary'>
                <Upload className='h-4 w-4' />
              </div>
              <CardTitle className='text-2xl font-black tracking-tight'>
                BAFA{' '}
                <span className='text-primary uppercase italic'>
                  Upload Center
                </span>
              </CardTitle>
            </div>
            <CardDescription className='font-bold text-muted-foreground/80'>
              Proactively provide the 13 essential documents for your funding
              application.
            </CardDescription>
          </div>

          <div className='flex items-center gap-3 bg-white/80 p-1.5 rounded-xl border border-primary/10 shadow-sm'>
            <span className='pl-3 text-xs font-black uppercase tracking-widest text-muted-foreground/60'>
              Application
            </span>
            <select
              className='bg-transparent border-none font-black text-sm focus:ring-0 cursor-pointer pr-8'
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              {projects.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                >
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent className='pt-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {documentTypes.map((type) => {
            const status = getDocStatus(type.name);
            const isMissing = status === 'none' || status === 'Requested';
            const isUploaded = status === 'Uploaded' || status === 'Approved';

            return (
              <div
                key={type.id}
                className={cn(
                  'relative group p-4 rounded-2xl border transition-all duration-500 flex flex-col justify-between overflow-hidden',
                  isUploaded
                    ? 'bg-white border-green-500/20 shadow-sm'
                    : 'bg-white border-border/40 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5',
                )}
              >
                {/* Background Decoration */}
                <div
                  className={cn(
                    'absolute -right-4 -top-4 h-16 w-16 rounded-full blur-3xl transition-opacity',
                    isUploaded
                      ? 'bg-green-500/10'
                      : 'bg-primary/5 opacity-0 group-hover:opacity-100',
                  )}
                />

                <div className='relative flex items-start justify-between mb-4'>
                  <div className='space-y-1 flex-1'>
                    <h3 className='font-black text-sm text-foreground leading-tight line-clamp-1'>
                      {type.name}
                    </h3>
                    <div className='flex items-center gap-2'>
                      {isUploaded ? (
                        <Badge className='h-5 bg-green-50 text-green-600 border-none px-2 text-[10px] font-black uppercase tracking-tighter shrink-0'>
                          Provided
                        </Badge>
                      ) : (
                        <Badge
                          variant='outline'
                          className='h-5 border-dashed text-[10px] font-black uppercase tracking-tighter text-muted-foreground'
                        >
                          {status === 'Requested' ? 'Requested' : 'Missing'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div
                    className={cn(
                      'h-9 w-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm',
                      isUploaded
                        ? 'bg-green-500 text-white'
                        : 'bg-muted/50 text-muted-foreground',
                    )}
                  >
                    {isUploaded ? (
                      <CheckCircle2 className='h-5 w-5' />
                    ) : (
                      <FileText className='h-5 w-5' />
                    )}
                  </div>
                </div>

                {!isUploaded && (
                  <Button
                    size='sm'
                    className='w-full rounded-xl font-black bg-white border-border/60 text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-xs'
                    onClick={() => triggerUpload(type.id)}
                    disabled={isUploading === type.id}
                  >
                    {isUploading === type.id ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : status === 'Requested' ? (
                      'Fulfill Now'
                    ) : (
                      'Quick Upload'
                    )}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
