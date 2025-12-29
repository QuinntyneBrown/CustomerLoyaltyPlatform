import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tenants',
    pathMatch: 'full'
  },
  {
    path: 'tenants',
    loadComponent: () => import('./tenants/tenant-list/tenant-list').then(m => m.TenantList)
  },
  {
    path: 'tenants/create',
    loadComponent: () => import('./tenants/tenant-create/tenant-create').then(m => m.TenantCreate)
  },
  {
    path: 'tenants/:id',
    loadComponent: () => import('./tenants/tenant-detail/tenant-detail').then(m => m.TenantDetail)
  }
];
