'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import React from 'react';

const routeLabels: Record<string, string> = {
  dashboard: 'Overview',
  clients: 'Clients',
  projects: 'Projects',
  documents: 'Documents',
  communication: 'Communication',
};

export function DynamicBreadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter((segment) => segment !== '');

  // Base breadcrumb: Dashboard
  const breadcrumbs = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      isCurrent: pathname === '/dashboard' || pathSegments.length === 0,
    },
  ];

  // Add subsequent segments
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    // Skip the first 'dashboard' segment as it's our base
    if (segment === 'dashboard') return;

    currentPath += `/${segment}`;
    const label =
      routeLabels[segment] ||
      segment.charAt(0).toUpperCase() + segment.slice(1);

    breadcrumbs.push({
      label,
      href: `/dashboard${currentPath}`,
      isCurrent: index === pathSegments.length - 1,
    });
  });

  return (
    <Breadcrumb className='hidden sm:block'>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            <BreadcrumbItem>
              {crumb.isCurrent ? (
                <BreadcrumbPage className='font-black text-primary'>
                  {crumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    href={crumb.href}
                    className='font-bold hover:text-primary transition-colors'
                  >
                    {crumb.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
