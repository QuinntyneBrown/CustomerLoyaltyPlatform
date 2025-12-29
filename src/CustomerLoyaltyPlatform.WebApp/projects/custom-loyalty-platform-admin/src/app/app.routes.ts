import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tenants',
    pathMatch: 'full'
  },
  // Tenant routes
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
  },
  // Business routes
  {
    path: 'tenants/:tenantId/businesses',
    loadComponent: () => import('./businesses/business-list/business-list').then(m => m.BusinessList)
  },
  {
    path: 'tenants/:tenantId/businesses/register',
    loadComponent: () => import('./businesses/business-register/business-register').then(m => m.BusinessRegister)
  },
  {
    path: 'tenants/:tenantId/businesses/:businessId',
    loadComponent: () => import('./businesses/business-detail/business-detail').then(m => m.BusinessDetail)
  },
  {
    path: 'tenants/:tenantId/businesses/:businessId/edit',
    loadComponent: () => import('./businesses/business-edit/business-edit').then(m => m.BusinessEdit)
  },
  // Member routes
  {
    path: 'tenants/:tenantId/members',
    loadComponent: () => import('./members/member-list/member-list').then(m => m.MemberList)
  },
  {
    path: 'tenants/:tenantId/members/enroll',
    loadComponent: () => import('./members/member-enroll/member-enroll').then(m => m.MemberEnroll)
  },
  {
    path: 'tenants/:tenantId/members/:memberId',
    loadComponent: () => import('./members/member-detail/member-detail').then(m => m.MemberDetail)
  },
  {
    path: 'tenants/:tenantId/members/:memberId/edit',
    loadComponent: () => import('./members/member-edit/member-edit').then(m => m.MemberEdit)
  },
  // Program routes
  {
    path: 'tenants/:tenantId/programs',
    loadComponent: () => import('./programs/program-list/program-list').then(m => m.ProgramList)
  },
  {
    path: 'tenants/:tenantId/programs/create',
    loadComponent: () => import('./programs/program-create/program-create').then(m => m.ProgramCreate)
  },
  {
    path: 'tenants/:tenantId/programs/:programId',
    loadComponent: () => import('./programs/program-detail/program-detail').then(m => m.ProgramDetail)
  },
  {
    path: 'tenants/:tenantId/programs/:programId/earning-rules/create',
    loadComponent: () => import('./programs/earning-rule-create/earning-rule-create').then(m => m.EarningRuleCreate)
  },
  // Points routes
  {
    path: 'tenants/:tenantId/members/:memberId/points',
    loadComponent: () => import('./points/member-points/member-points').then(m => m.MemberPoints)
  },
  {
    path: 'tenants/:tenantId/points/earn',
    loadComponent: () => import('./points/points-earn/points-earn').then(m => m.PointsEarn)
  },
  {
    path: 'tenants/:tenantId/points/redeem',
    loadComponent: () => import('./points/points-redeem/points-redeem').then(m => m.PointsRedeem)
  },
  // User routes
  {
    path: 'tenants/:tenantId/users',
    loadComponent: () => import('./users/user-list/user-list').then(m => m.UserList)
  },
  {
    path: 'tenants/:tenantId/users/invite',
    loadComponent: () => import('./users/user-invite/user-invite').then(m => m.UserInvite)
  }
];
