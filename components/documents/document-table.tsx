'use client';

import { useState, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  Upload,
  MoreHorizontal,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Eye,
  Briefcase,
  History,
  Loader2,
} from 'lucide-react';
import {
  updateDocumentStatus,
  fulfillDocumentRequest,
} from '@/app/actions/documents';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface Document {
  id: string;
  fileName: string;
  project: {
    name: string;
  };
  type: {
    name: string;
  };
  state: {
    name: string;
  };
  createdAt: Date;
}

interface DocumentTableProps {
  documents: Document[];
  role?: string;
}

export function DocumentTable({ documents, role }: DocumentTableProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const isClient = role === 'CLIENT';

  async function handleStatusUpdate(documentId: string, status: string) {
    setIsUpdating(documentId);
    const result = await updateDocumentStatus(documentId, status);

    if (result.success) {
      toast.success(`Document marked as ${status}`);
    } else {
      toast.error('Failed to update document status');
    }
    setIsUpdating(null);
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !activeDocId) return;

    setIsUpdating(activeDocId);
    const supabase = createClient();

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `fulfillment/${activeDocId}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw new Error(uploadError.message);

      const result = await fulfillDocumentRequest(
        activeDocId,
        file.name,
        data.path,
      );

      if (result.success) {
        toast.success('Document uploaded successfully');
      } else {
        // Atomic Cleanup: If DB update fails, delete the file from storage
        console.warn('DB update failed, cleaning up storage...');
        await supabase.storage.from('documents').remove([data.path]);
        toast.error('Failed to sync document to database');
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error(error.message || 'Failed to upload document');
    } finally {
      setIsUpdating(null);
      setActiveDocId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function triggerFulfill(documentId: string) {
    setActiveDocId(documentId);
    fileInputRef.current?.click();
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <Badge className='bg-green-100 text-green-700 border-none px-3 py-1 font-black rounded-lg gap-1.5'>
            <CheckCircle2 className='h-3 w-3' />
            Approved
          </Badge>
        );
      case 'Requested':
        return (
          <Badge className='bg-amber-100 text-amber-700 border-none px-3 py-1 font-black rounded-lg gap-1.5'>
            <Clock className='h-3 w-3' />
            Requested
          </Badge>
        );
      case 'Uploaded':
        return (
          <Badge className='bg-blue-100 text-blue-700 border-none px-3 py-1 font-black rounded-lg gap-1.5'>
            <FileText className='h-3 w-3' />
            Uploaded
          </Badge>
        );
      case 'Correction Required':
        return (
          <Badge className='bg-red-100 text-red-700 border-none px-3 py-1 font-black rounded-lg gap-1.5'>
            <XCircle className='h-3 w-3' />
            Revision
          </Badge>
        );
      default:
        return (
          <Badge
            variant='secondary'
            className='font-black px-3 py-1 rounded-lg'
          >
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card className='glass-card w-full border-none shadow-sm overflow-hidden'>
      {/* Hidden File Input */}
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileSelect}
        className='hidden'
        accept='.pdf,.doc,.docx,.jpg,.jpeg,.png'
      />

      <CardHeader className='pb-0'>
        <CardTitle className='text-2xl font-black tracking-tight text-foreground'>
          {isClient ? 'Document Records' : 'Document Inventory'}
        </CardTitle>
        <CardDescription className='font-medium text-muted-foreground'>
          {isClient
            ? 'Track and fulfill documentation requests for your funding applications.'
            : 'Review and approve client financial documents.'}
        </CardDescription>
      </CardHeader>
      <CardContent className='pt-6'>
        <div className='rounded-2xl border border-border/40 overflow-hidden bg-white/50 backdrop-blur-sm shadow-inner'>
          <Table>
            <TableHeader className='bg-muted/50'>
              <TableRow className='hover:bg-transparent border-border/40'>
                <TableHead className='font-black uppercase tracking-widest text-[11px] py-5 pl-6'>
                  File & Project
                </TableHead>
                <TableHead className='font-black uppercase tracking-widest text-[11px] py-5'>
                  Document Type
                </TableHead>
                <TableHead className='font-black uppercase tracking-widest text-[11px] py-5'>
                  Status
                </TableHead>
                <TableHead className='font-black uppercase tracking-widest text-[11px] py-5 text-right pr-6'>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className='h-32 text-center text-muted-foreground font-bold'
                  >
                    No documents found.
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc) => (
                  <TableRow
                    key={doc.id}
                    className='hover:bg-primary/5 transition-all duration-300 border-border/20 group'
                  >
                    <TableCell className='py-4 pl-6'>
                      <div className='flex items-center gap-4'>
                        <div
                          className={cn(
                            'h-10 w-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform',
                            doc.state.name === 'Requested'
                              ? 'bg-amber-100 text-amber-600'
                              : 'bg-primary/5 text-primary',
                          )}
                        >
                          <FileText className='h-5 w-5' />
                        </div>
                        <div className='flex-1 min-w-0 max-w-[300px]'>
                          <div className='flex items-center group-hover:text-primary transition-colors mb-1'>
                            <p className='font-black text-foreground leading-none truncate'>
                              {doc.fileName.split('.').slice(0, -1).join('.') ||
                                doc.fileName}
                            </p>
                            {doc.fileName.includes('.') && (
                              <p className='font-black text-foreground leading-none shrink-0'>
                                .{doc.fileName.split('.').pop()}
                              </p>
                            )}
                          </div>
                          <p className='text-xs font-bold text-muted-foreground tracking-tight flex items-center gap-1 truncate'>
                            <Briefcase className='h-3 w-3 opacity-50 shrink-0' />
                            <span className='truncate'>
                              {doc.project?.name || 'Local Project'}
                            </span>
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='py-4'>
                      <span className='font-bold text-sm text-foreground'>
                        {doc.type.name}
                      </span>
                    </TableCell>
                    <TableCell className='py-4'>
                      {getStatusBadge(doc.state.name)}
                    </TableCell>
                    <TableCell className='py-4 text-right pr-6'>
                      {isClient &&
                      (doc.state.name === 'Requested' ||
                        doc.state.name === 'Correction Required') ? (
                        <Button
                          size='sm'
                          className='rounded-lg font-black bg-primary text-white shadow-sm hover:scale-105 transition-all'
                          onClick={() => triggerFulfill(doc.id)}
                          disabled={isUpdating === doc.id}
                        >
                          {isUpdating === doc.id ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                          ) : (
                            <>
                              <Upload className='h-4 w-4 mr-2' />
                              Upload
                            </>
                          )}
                        </Button>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              disabled={isUpdating === doc.id}
                              className='h-9 w-9 rounded-xl hover:bg-white hover:shadow-sm transition-all text-muted-foreground hover:text-primary'
                            >
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align='end'
                            className='w-56 p-2 rounded-lg border-border/40 shadow-lg backdrop-blur-xl bg-white/90'
                          >
                            <DropdownMenuLabel className='px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60'>
                              Document Actions
                            </DropdownMenuLabel>

                            {doc.state.name !== 'Requested' && (
                              <>
                                <DropdownMenuItem className='cursor-pointer rounded-lg p-3 focus:bg-primary/10 focus:text-primary group'>
                                  <Eye className='mr-3 h-4 w-4 transition-transform group-hover:scale-110' />
                                  <span className='font-bold'>View File</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className='cursor-pointer rounded-lg p-3 focus:bg-primary/10 focus:text-primary group'>
                                  <Download className='mr-3 h-4 w-4 transition-transform group-hover:scale-110' />
                                  <span className='font-bold'>Download</span>
                                </DropdownMenuItem>
                              </>
                            )}

                            {!isClient && (
                              <>
                                <DropdownMenuSeparator className='bg-border/70 my-2' />
                                <DropdownMenuItem
                                  className='cursor-pointer rounded-lg p-3 focus:bg-green-50 focus:text-green-600 group'
                                  onClick={() =>
                                    handleStatusUpdate(doc.id, 'Approved')
                                  }
                                >
                                  <CheckCircle2 className='mr-3 h-4 w-4 text-green-500' />
                                  <span className='font-bold'>
                                    Approve Document
                                  </span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className='cursor-pointer rounded-lg p-3 focus:bg-red-50 focus:text-red-600 group'
                                  onClick={() =>
                                    handleStatusUpdate(
                                      doc.id,
                                      'Correction Required',
                                    )
                                  }
                                >
                                  <XCircle className='mr-3 h-4 w-4 text-red-500' />
                                  <span className='font-bold'>
                                    Reject / Revision
                                  </span>
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
