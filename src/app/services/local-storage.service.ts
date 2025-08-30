import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly platformId: object = inject(PLATFORM_ID);
  private isBrowser: boolean = isPlatformBrowser(this.platformId);

  get<T>(key: string): T | null {
    if (!this.isBrowser) {
      return null;
    }
    
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      // Tự động xóa item bị lỗi
      this.remove(key);
      return null;
    }
  }

  set(key: string, value: any): boolean {
    if (!this.isBrowser) {
      return false;
    }
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      return false;
    }
  }

  remove(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }

  clear(): void {
    if (this.isBrowser) {
      localStorage.clear();
    }
  }

  has(key: string): boolean {
    if (!this.isBrowser) {
      return false;
    }
    return localStorage.getItem(key) !== null;
  }

  // Lấy tất cả keys
  keys(): string[] {
    if (!this.isBrowser) {
      return [];
    }
    return Object.keys(localStorage);
  }
}
