import { inject, Pipe, PipeTransform } from '@angular/core';
import { getLangs } from '../constant/lang.constant';
import { TLanguage } from '../../models/lang.interface';
import { LangService } from '../../services/lang.service';

@Pipe({
  name: 'localeCode',
  standalone: true
})
export class LangLocalePipe implements PipeTransform {
  private readonly langs = getLangs();
  transform(code: string, ...args: unknown[]): string | null {
    const lang = this.langs.find(l => l.code === code);

    if (!lang) throw new Error(`LangPipe: Không tìm thấy ngôn ngữ với code = ${code}`);
    const field = args[0] as 'locale' | 'name' | undefined;
    if (field === 'name') return lang.name;
    return lang.locale;
  }
}

@Pipe({
  name: 'lang',
  standalone: true
})
export class LangPipe implements PipeTransform {
  private readonly currentLang = inject(LangService).getCurrentLang();
  transform(value: Record<TLanguage, string>): string {
    return value[this.currentLang];
  }
}