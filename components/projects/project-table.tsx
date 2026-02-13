'use client';

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
import { ProjectStatusSelect } from './project-status-select';
import { Calendar, User, Briefcase, Eye } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  client: {
    name: string | null;
    email: string;
  };
  caseStatusId: string;
  createdAt: Date;
}

interface Status {
  id: string;
  name: string;
}

interface ProjectTableProps {
  projects: Project[];
  statuses: Status[];
  role?: string;
}

export function ProjectTable({ projects, statuses, role }: ProjectTableProps) {
  const isConsultant = role === 'CONSULTANT';
  const isClient = role === 'CLIENT';

  return (
    <Card className='glass-card w-full border-none shadow-sm overflow-hidden'>
      <CardHeader className='pb-0'>
        <CardTitle className='text-2xl font-black tracking-tight text-foreground'>
          {isConsultant
            ? 'Assigned Case Portfolio'
            : isClient
              ? 'Active Funding Projects'
              : 'Project Pipeline'}
        </CardTitle>
        <CardDescription className='font-medium text-muted-foreground'>
          {isConsultant
            ? 'Manage and monitor projects you are currently consulting on.'
            : isClient
              ? 'View and manage your current funding applications.'
              : 'Track and advance case stages for all clients.'}
        </CardDescription>
      </CardHeader>
      <CardContent className='pt-6'>
        <div className='rounded-2xl border border-border/40 overflow-hidden bg-white/50 backdrop-blur-sm shadow-inner'>
          <Table>
            <TableHeader className='bg-muted/50'>
              <TableRow className='hover:bg-transparent border-border/40'>
                <TableHead className='font-black uppercase tracking-widest text-[11px] py-5 pl-6'>
                  Project & Client
                </TableHead>
                <TableHead className='font-black uppercase tracking-widest text-[11px] py-5'>
                  Current Status
                </TableHead>
                <TableHead className='font-black uppercase tracking-widest text-[11px] py-5'>
                  Registration Date
                </TableHead>
                <TableHead className='font-black uppercase tracking-widest text-[11px] py-5 text-right pr-6'>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className='h-32 text-center text-muted-foreground font-bold'
                  >
                    No projects found.
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow
                    key={project.id}
                    className='hover:bg-primary/5 transition-all duration-300 border-border/20 group'
                  >
                    <TableCell className='py-4 pl-6'>
                      <div className='flex items-center gap-4'>
                        <div className='h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform'>
                          <Briefcase className='h-5 w-5' />
                        </div>
                        <div>
                          <p className='font-black text-foreground leading-none mb-1 group-hover:text-primary transition-colors'>
                            {project.name}
                          </p>
                          <p className='text-xs font-bold text-muted-foreground tracking-tight flex items-center gap-1'>
                            <User className='h-3 w-3 opacity-50' />
                            {project.client.name || project.client.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='py-4'>
                      <ProjectStatusSelect
                        projectId={project.id}
                        currentStatusId={project.caseStatusId}
                        statuses={statuses}
                      />
                    </TableCell>
                    <TableCell className='py-4 text-sm font-bold text-muted-foreground'>
                      <div className='flex items-center gap-2'>
                        <Calendar className='h-3.5 w-3.5 opacity-50' />
                        {new Date(project.createdAt).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          },
                        )}
                      </div>
                    </TableCell>
                    <TableCell className='py-4 text-right pr-6'>
                      <Button
                        asChild
                        variant='ghost'
                        size='sm'
                        className='rounded-lg font-bold gap-2 hover:bg-white hover:text-primary transition-all border border-transparent hover:border-primary/20 cursor-pointer'
                      >
                        <Link href={`/dashboard/projects/${project.id}`}>
                          <Eye className='h-4 w-4' />
                          Details
                        </Link>
                      </Button>
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
