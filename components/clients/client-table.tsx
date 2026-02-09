'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  MoreHorizontal,
  ArrowUpDown,
  Eye,
  Mail,
  Phone,
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

// Type definition (can be moved to types file later)
export interface Client {
  id: string;
  full_name: string;
  email: string;
  company_name: string | null;
  phone: string | null;
  role: string;
  createdAt: Date;
  // Add more fields as needed (e.g., status, last_active)
}

interface ClientTableProps {
  clients: Client[];
}

export function ClientTable({ clients: initialClients }: ClientTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and Sort Logic
  const filteredClients = initialClients
    .filter(
      (client) =>
        client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.company_name &&
          client.company_name.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const toggleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Card className='glass-card w-full border-none shadow-lg'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='text-2xl font-bold text-gray-800'>
              Clients
            </CardTitle>
            <CardDescription className='text-gray-500'>
              Manage your client base and view their profiles.
            </CardDescription>
          </div>
          <div className='flex items-center space-x-2'>
            <div className='relative'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500' />
              <Input
                type='search'
                placeholder='Search clients...'
                className='pl-9 w-[250px] bg-white/50 border-gray-200 focus:ring-primary/20'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant='outline'
              className='bg-white/50 border-gray-200'
            >
              <Filter className='mr-2 h-4 w-4' />
              Filter
            </Button>
            <Button className='bg-primary hover:bg-primary/90 text-white shadow-md transition-all hover:scale-105'>
              Add Client
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='rounded-md border border-gray-100 overflow-hidden'>
          <Table>
            <TableHeader className='bg-gray-50/50'>
              <TableRow>
                <TableHead className='w-[300px]'>Client</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead
                  className='text-right cursor-pointer hover:text-primary transition-colors'
                  onClick={toggleSort}
                >
                  Joined <ArrowUpDown className='ml-1 h-3 w-3 inline' />
                </TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className='h-24 text-center text-gray-500'
                  >
                    No clients found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow
                    key={client.id}
                    className='hover:bg-gray-50/30 transition-colors group'
                  >
                    <TableCell className='font-medium'>
                      <div className='flex items-center space-x-3'>
                        <Avatar className='h-9 w-9 ring-2 ring-white shadow-sm'>
                          <AvatarImage
                            src={`https://avatar.vercel.sh/${client.email}`}
                            alt={client.full_name}
                          />
                          <AvatarFallback className='bg-primary/10 text-primary'>
                            {client.full_name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-semibold text-gray-900'>
                            {client.full_name}
                          </p>
                          <p className='text-xs text-gray-500'>
                            {client.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {client.company_name ? (
                        <div className='flex items-center text-sm text-gray-700'>
                          {client.company_name}
                        </div>
                      ) : (
                        <span className='text-gray-400 italic text-sm'>--</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-col space-y-1'>
                        {client.phone && (
                          <div className='flex items-center text-xs text-gray-500'>
                            <Phone className='h-3 w-3 mr-1' /> {client.phone}
                          </div>
                        )}
                        <div className='flex items-center text-xs text-gray-500'>
                          <Mail className='h-3 w-3 mr-1' /> Email
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='secondary'
                        className='bg-green-100 text-green-700 hover:bg-green-200 border-green-200'
                      >
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right text-gray-500'>
                      {new Date(client.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-gray-400 hover:text-gray-700'
                          >
                            <MoreHorizontal className='h-4 w-4' />
                            <span className='sr-only'>Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align='end'
                          className='w-[160px]'
                        >
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className='cursor-pointer'>
                            <Eye className='mr-2 h-4 w-4' /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className='cursor-pointer'>
                            <Mail className='mr-2 h-4 w-4' /> Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className='text-red-600 focus:text-red-600 cursor-pointer'>
                            Delete Client
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
