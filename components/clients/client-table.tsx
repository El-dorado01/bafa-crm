'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Mail,
  Briefcase,
  History,
  User as UserIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
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
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface Client {
  id: string;
  name: string;
  email: string;
  companyName: string | null;
  projectCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ClientTableProps {
  clients: Client[];
}

export function ClientTable({ clients: initialClients }: ClientTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = initialClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.companyName &&
        client.companyName.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <Card className='glass-card w-full border-none shadow-sm overflow-hidden'>
      <CardHeader className='pb-0'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <CardTitle className='text-2xl font-black tracking-tight text-foreground'>
              Active Clients
            </CardTitle>
            <CardDescription className='font-medium text-muted-foreground'>
              Monitor and manage your client base.
            </CardDescription>
          </div>
          <div className='flex items-center gap-3'>
            <div className='relative group'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
              <Input
                type='search'
                placeholder='Search by name or company...'
                className='pl-10 w-full md:w-[300px] bg-muted/50 border-border/40 focus:bg-white transition-all rounded-xl font-medium'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant='outline'
              className='rounded-xl border-border/40 font-bold gap-2'
            >
              <Filter className='h-4 w-4' />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className='pt-6'>
        <div className='rounded-2xl border border-border/40 overflow-hidden bg-white/50 backdrop-blur-sm shadow-inner'>
          <Table>
            <TableHeader className='bg-muted/50'>
              <TableRow className='hover:bg-transparent border-border/40'>
                <TableHead className='font-black uppercase tracking-widest text-[11px] py-5 pl-6'>
                  Client Info
                </TableHead>
                <TableHead className='font-black uppercase tracking-widest text-[11px] py-5'>
                  Company
                </TableHead>
                <TableHead className='font-black uppercase tracking-widest text-[11px] py-5'>
                  Active Projects
                </TableHead>
                <TableHead className='font-black uppercase tracking-widest text-[11px] py-5'>
                  Last Activity
                </TableHead>
                <TableHead className='font-black uppercase tracking-widest text-[11px] py-5 text-right pr-6'>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className='h-32 text-center text-muted-foreground font-bold'
                  >
                    No clients discovered in the database.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow
                    key={client.id}
                    className='hover:bg-primary/5 transition-all duration-300 border-border/20 group'
                  >
                    <TableCell className='py-4 pl-6'>
                      <div className='flex items-center gap-4'>
                        <Avatar className='h-10 w-10 border-2 border-white shadow-sm transition-transform group-hover:scale-110 duration-500'>
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${client.name}`}
                            alt={client.name}
                          />
                          <AvatarFallback className='bg-primary/10 text-primary font-black uppercase text-xs'>
                            {client.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-black text-foreground leading-none mb-1 group-hover:text-primary transition-colors'>
                            {client.name}
                          </p>
                          <p className='text-xs font-bold text-muted-foreground tracking-tight'>
                            {client.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='py-4'>
                      {client.companyName ? (
                        <div className='flex items-center gap-2 font-bold text-foreground text-sm'>
                          <div className='h-2 w-2 rounded-full bg-primary/30' />
                          {client.companyName}
                        </div>
                      ) : (
                        <span className='text-muted-foreground/40 italic font-medium text-xs'>
                          Not specified
                        </span>
                      )}
                    </TableCell>
                    <TableCell className='py-4'>
                      <Badge
                        variant='secondary'
                        className='bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1 font-black rounded-lg transition-all gap-2'
                      >
                        <Briefcase className='h-3 w-3' />
                        {client.projectCount} Projects
                      </Badge>
                    </TableCell>
                    <TableCell className='py-4 text-sm font-bold text-muted-foreground'>
                      <div className='flex items-center gap-2'>
                        <History className='h-3.5 w-3.5 opacity-50' />
                        {new Date(client.updatedAt).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                          },
                        )}
                      </div>
                    </TableCell>
                    <TableCell className='py-4 text-right pr-6'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
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
                            Client Actions
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            asChild
                            className='cursor-pointer rounded-lg p-3 focus:bg-primary/10 focus:text-primary group'
                          >
                            <Link href={`/dashboard/clients/${client.id}`}>
                              <Eye className='mr-3 h-4 w-4 transition-transform group-hover:scale-110' />
                              <span className='font-bold'>View Dashboard</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className='cursor-pointer rounded-lg p-3 focus:bg-primary/10 focus:text-primary group'>
                            <Mail className='mr-3 h-4 w-4 transition-transform group-hover:scale-110' />
                            <span className='font-bold'>Contact Client</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className='bg-border/70 my-2' />
                          <DropdownMenuItem
                            asChild
                            className='cursor-pointer rounded-lg p-3 group focus:bg-primary/10 focus:text-primary'
                          >
                            <Link href={`/dashboard/clients/${client.id}`}>
                              <UserIcon className='mr-3 h-4 w-4 transition-transform group-hover:scale-110' />
                              <span className='font-bold'>Review Profile</span>
                            </Link>
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
