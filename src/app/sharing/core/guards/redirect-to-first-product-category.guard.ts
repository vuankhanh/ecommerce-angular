import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from 'express';

export const redirectToFirstProductCategoryGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  console.log(route);
  // router.navigate(['san-pham', 'sashimi']);
  return true;
};
