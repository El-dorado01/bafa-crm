'use client';

import { CheckCircle2, Circle, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Status {
  id: string;
  name: string;
  order: number;
}

interface CaseTimelineProps {
  statuses: Status[];
  currentStatusId: string;
}

export function CaseTimeline({ statuses, currentStatusId }: CaseTimelineProps) {
  const currentStatus = statuses.find((s) => s.id === currentStatusId);
  const currentOrder = currentStatus?.order || 0;

  // Stages that require consultant input traditionally
  const actionRequiredStages = [
    'Consultation',
    'Reporting',
    'Document Collection',
  ];
  const isActionRequired = actionRequiredStages.includes(
    currentStatus?.name || '',
  );

  return (
    <div className='w-full py-4 md:py-8 px-3'>
      {/* Horizontal Timeline - Hidden on Mobile, Visible on Desktop */}
      <div className='overflow-x-auto pt-4 pb-12 no-scrollbar'>
        <div
          className='relative flex items-center justify-between mx-auto px-5'
          style={{ minWidth: `${statuses.length * 128}px`, maxWidth: '1400px' }}
        >
          {/* Progress Line Background */}
          <div className='absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-muted rounded-full overflow-hidden'>
            <div
              className='h-full bg-primary transition-all duration-1000 ease-out'
              style={{
                width: `${((currentOrder - 1) / (statuses.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Status Nodes */}
          {statuses.map((status) => {
            const isCompleted = status.order < currentOrder;
            const isCurrent = status.id === currentStatusId;
            const isFuture = status.order > currentOrder;
            const needsAttention = isCurrent && isActionRequired;

            return (
              <div
                key={status.id}
                className='relative flex flex-col items-center group shrink-0'
                style={{ width: '80px' }}
              >
                <div
                  className={cn(
                    'h-10 w-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 border-4 bg-white shadow-sm',
                    isCompleted && 'border-primary text-primary bg-primary/5',
                    isCurrent &&
                      'border-primary border-dashed ring-4 ring-primary/20 scale-110',
                    needsAttention &&
                      'border-amber-500 ring-amber-500/20 text-amber-500',
                    isFuture && 'border-muted text-muted-foreground',
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className='h-5 w-5 fill-primary text-white' />
                  ) : needsAttention ? (
                    <AlertCircle className='h-5 w-5 animate-pulse' />
                  ) : (
                    <Circle
                      className={cn(
                        'h-2.5 w-2.5 fill-current',
                        !isCurrent && 'opacity-20',
                      )}
                    />
                  )}
                </div>

                <div className='absolute top-12 flex flex-col items-center w-32 text-center'>
                  <span
                    className={cn(
                      'text-[9px] font-black uppercase tracking-tight leading-loose transition-colors wrap-break-word text-wrap',
                      isCurrent
                        ? 'text-primary'
                        : isCompleted
                          ? 'text-foreground'
                          : 'text-muted-foreground',
                    )}
                  >
                    {status.name}
                  </span>
                  {isCurrent && (
                    <div
                      className={cn(
                        'mt-1 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest animate-in slide-in-from-top-1 duration-500',
                        needsAttention
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-primary/10 text-primary',
                      )}
                    >
                      {needsAttention ? 'Action Required' : 'In Progress'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {needsSummary(currentStatus?.name) && (
        <div className='mt-32 md:mt-16 max-w-2xl mx-auto p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700'>
          <div className='h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0'>
            <ArrowRight className='h-6 w-6' />
          </div>
          <div>
            <p className='text-xs font-black uppercase text-primary/60 tracking-widest'>
              Next Milestone
            </p>
            <p className='text-sm font-bold text-foreground'>
              {currentStatus?.name === 'Consultation'
                ? 'Complete the consultation phase and prepare the Reporting documents to unlock BAFA Review.'
                : 'System is monitoring for updates. Ensure all required documents are uploaded.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Badge({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: 'primary' | 'amber';
}) {
  return (
    <div
      className={cn(
        'inline-flex px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest',
        variant === 'amber'
          ? 'bg-amber-100 text-amber-700'
          : 'bg-primary/10 text-primary',
      )}
    >
      {children}
    </div>
  );
}

function needsSummary(statusName?: string) {
  return (
    statusName === 'Consultation' ||
    statusName === 'Reporting' ||
    statusName === 'Document Collection'
  );
}
