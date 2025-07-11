import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

export function initializeIcons(
  matIconRegistry: MatIconRegistry, 
  domSanitizer: DomSanitizer
): boolean {
  // Đăng ký Font Awesome
  matIconRegistry.registerFontClassAlias('fa', 'fa');
  matIconRegistry.registerFontClassAlias('fab', 'fab');
  matIconRegistry.registerFontClassAlias('fas', 'fas');
  
  return true;
}

// Provider function
export function provideIconConfig() {
  return {
    provide: 'ICON_INITIALIZER',
    useFactory: initializeIcons,
    deps: [MatIconRegistry, DomSanitizer]
  };
}