'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Building,
  User,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  Loader2,
} from 'lucide-react';
import { updateCompanyProfile } from '@/app/actions/profile';
import { toast } from 'sonner';

interface CompanyProfileFormProps {
  dbUser: {
    id: string;
    name: string | null;
    email: string;
    profile: {
      companyName: string | null;
      address: string | null;
      legalForm: string | null;
      foundingDate: Date | null;
      industry: string | null;
    } | null;
  };
}

export function CompanyProfileForm({ dbUser }: CompanyProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const profile = dbUser.profile;

  const [formData, setFormData] = useState({
    name: dbUser.name || '',
    companyName: profile?.companyName || '',
    legalForm: profile?.legalForm || '',
    industry: profile?.industry || '',
    foundingDate: profile?.foundingDate
      ? new Date(profile.foundingDate).toISOString().split('T')[0]
      : '',
    address: profile?.address || '',
  });

  const handleSave = async () => {
    setLoading(true);
    const result = await updateCompanyProfile({
      userId: dbUser.id,
      ...formData,
      foundingDate: formData.foundingDate
        ? new Date(formData.foundingDate)
        : undefined,
    });

    if (result.success) {
      toast.success('Profile updated successfully');
    } else {
      toast.error('Failed to update profile');
    }
    setLoading(false);
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
      {/* Left Column: Forms */}
      <div className='lg:col-span-8 space-y-8'>
        <Card className='border-none shadow-xl glass-card overflow-hidden ring-1 ring-primary/5'>
          <CardHeader className='pb-6 bg-linear-to-r from-primary/5 to-transparent border-b border-primary/5'>
            <div className='flex items-center gap-2'>
              <User className='h-5 w-5 text-primary' />
              <CardTitle className='text-xl font-bold'>
                Client Identity
              </CardTitle>
            </div>
            <CardDescription>Your personal and account details</CardDescription>
          </CardHeader>
          <CardContent className='pt-8 space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <Label className='font-black text-xs uppercase tracking-widest opacity-60'>
                  Full Name
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className='rounded-xl border-border/40 bg-white/50 focus:bg-white transition-all font-bold h-12'
                />
              </div>
              <div className='space-y-2'>
                <Label className='font-black text-xs uppercase tracking-widest opacity-60'>
                  Email Address
                </Label>
                <Input
                  value={dbUser.email}
                  readOnly
                  className='rounded-xl border-border/40 bg-muted/30 font-bold h-12 cursor-not-allowed opacity-60'
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-none shadow-xl glass-card overflow-hidden ring-1 ring-primary/5'>
          <CardHeader className='pb-6 bg-linear-to-r from-blue-500/5 to-transparent border-b border-primary/5'>
            <div className='flex items-center gap-2'>
              <Building className='h-5 w-5 text-blue-500' />
              <CardTitle className='text-xl font-bold'>
                Company Documentation
              </CardTitle>
            </div>
            <CardDescription>
              Official business details recorded in your applications
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-8 space-y-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <Label className='font-black text-xs uppercase tracking-widest opacity-60'>
                  Company Name
                </Label>
                <Input
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className='rounded-xl border-border/40 bg-white/50 focus:bg-white transition-all font-bold h-12'
                />
              </div>
              <div className='space-y-2'>
                <Label className='font-black text-xs uppercase tracking-widest opacity-60'>
                  Legal Form
                </Label>
                <Input
                  value={formData.legalForm}
                  onChange={(e) =>
                    setFormData({ ...formData, legalForm: e.target.value })
                  }
                  placeholder='e.g. GmbH, UG, Einzelunternehmen'
                  className='rounded-xl border-border/40 bg-white/50 focus:bg-white transition-all font-bold h-12'
                />
              </div>
              <div className='space-y-2'>
                <Label className='font-black text-xs uppercase tracking-widest opacity-60'>
                  Industry
                </Label>
                <Input
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                  className='rounded-xl border-border/40 bg-white/50 focus:bg-white transition-all font-bold h-12'
                />
              </div>
              <div className='space-y-2'>
                <Label className='font-black text-xs uppercase tracking-widest opacity-60'>
                  Founding Date
                </Label>
                <Input
                  type='date'
                  value={formData.foundingDate}
                  onChange={(e) =>
                    setFormData({ ...formData, foundingDate: e.target.value })
                  }
                  className='rounded-xl border-border/40 bg-white/50 focus:bg-white transition-all font-bold h-12'
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label className='font-black text-xs uppercase tracking-widest opacity-60'>
                Business Address
              </Label>
              <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                rows={3}
                className='w-full rounded-xl border border-border/40 bg-white/50 focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all font-bold p-4 resize-none'
              />
            </div>

            <div className='flex justify-end pt-4'>
              <Button
                onClick={handleSave}
                disabled={loading}
                className='rounded-xl font-black bg-primary px-8 h-12 shadow-lg shadow-primary/20 hover:scale-105 transition-all w-full md:w-auto'
              >
                {loading ? (
                  <Loader2 className='h-5 w-5 animate-spin' />
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Status & Preview */}
      <div className='lg:col-span-4 space-y-6'>
        <Card className='border-none shadow-xl bg-linear-to-br from-primary/10 to-blue-500/5 ring-1 ring-primary/10 overflow-hidden'>
          <CardHeader>
            <CardTitle className='text-sm font-black uppercase tracking-widest text-primary'>
              Profile Health
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0 font-black text-primary'>
                85%
              </div>
              <div>
                <p className='font-black text-sm leading-tight'>
                  Completion Score
                </p>
                <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>
                  Almost BAFA Ready
                </p>
              </div>
            </div>
            <div className='h-2 w-full bg-white/50 rounded-full overflow-hidden'>
              <div
                className='h-full bg-primary rounded-full'
                style={{ width: '85%' }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className='border-none shadow-xl glass-card ring-1 ring-border/40 overflow-hidden'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-black uppercase tracking-widest opacity-60'>
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-start gap-3 p-3 rounded-xl bg-muted/30'>
              <Mail className='h-4 w-4 text-primary mt-1 shrink-0' />
              <div className='overflow-hidden'>
                <p className='text-[10px] font-black uppercase tracking-wider text-muted-foreground'>
                  Email
                </p>
                <p className='font-bold text-sm truncate'>{dbUser.email}</p>
              </div>
            </div>
            <div className='flex items-start gap-3 p-3 rounded-xl bg-muted/30'>
              <MapPin className='h-4 w-4 text-blue-500 mt-1 shrink-0' />
              <div className='overflow-hidden'>
                <p className='text-[10px] font-black uppercase tracking-wider text-muted-foreground'>
                  Address
                </p>
                <p className='font-bold text-sm line-clamp-2'>
                  {formData.address || 'Not specified'}
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3 p-3 rounded-xl bg-muted/30'>
              <Briefcase className='h-4 w-4 text-amber-500 mt-1 shrink-0' />
              <div className='overflow-hidden'>
                <p className='text-[10px] font-black uppercase tracking-wider text-muted-foreground'>
                  Industry
                </p>
                <p className='font-bold text-sm'>
                  {formData.industry || 'Not specified'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
