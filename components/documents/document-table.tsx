'use client';

import { useState } from 'react';
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
import {
  MoreHorizontal,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Eye,
  Briefcase,
  History,
} from 'lucide-react';
import { updateDocumentStatus } from '@/app/actions/documents';
import { toast } from 'sonner';

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
}

export function DocumentTable({ documents }: DocumentTableProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

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
      <CardHeader className='pb-0'>
        <CardTitle className='text-2xl font-black tracking-tight text-foreground'>
          Document Inventory
        </CardTitle>
        <CardDescription className='font-medium text-muted-foreground'>
          Review and approve client financial documents.
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
                    No documents currently in review.
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
                        <div className='h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform'>
                          <FileText className='h-5 w-5' />
                        </div>
                        <div>
                          <p className='font-black text-foreground leading-none mb-1 group-hover:text-primary transition-colors'>
                            {doc.fileName}
                          </p>
                          <p className='text-xs font-bold text-muted-foreground tracking-tight flex items-center gap-1'>
                            <Briefcase className='h-3 w-3 opacity-50' />
                            {doc.project.name}
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
                          <DropdownMenuItem className='cursor-pointer rounded-lg p-3 focus:bg-primary/10 focus:text-primary group'>
                            <Eye className='mr-3 h-4 w-4 transition-transform group-hover:scale-110' />
                            <span className='font-bold'>View File</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className='cursor-pointer rounded-lg p-3 focus:bg-primary/10 focus:text-primary group'>
                            <Download className='mr-3 h-4 w-4 transition-transform group-hover:scale-110' />
                            <span className='font-bold'>Download</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className='bg-border/70 my-2' />
                          <DropdownMenuItem
                            className='cursor-pointer rounded-lg p-3 focus:bg-green-50 focus:text-green-600 group'
                            onClick={() =>
                              handleStatusUpdate(doc.id, 'Approved')
                            }
                          >
                            <CheckCircle2 className='mr-3 h-4 w-4 text-green-500' />
                            <span className='font-bold'>Approve Document</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className='cursor-pointer rounded-lg p-3 focus:bg-red-50 focus:text-red-600 group'
                            onClick={() =>
                              handleStatusUpdate(doc.id, 'Correction Required')
                            }
                          >
                            <XCircle className='mr-3 h-4 w-4 text-red-500' />
                            <span className='font-bold'>Reject / Revision</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
