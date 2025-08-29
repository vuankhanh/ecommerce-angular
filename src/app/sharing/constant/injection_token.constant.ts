import { InjectionToken } from '@angular/core';
import { Language } from './lang.constant';

export const SSR_LANG = new InjectionToken<`${Language}`>('SSR_LANG');