import { Pipe, PipeTransform } from '@angular/core';
import { getLangs } from '../constant/lang.constant';

@Pipe({
  name: 'lang'
})
export class LangPipe implements PipeTransform {
  private readonly langs = getLangs();
  transform(code: string, ...args: unknown[]): string | null {
    let lang = this.langs.find(l => l.code === code);

    if (!lang) throw new Error(`LangPipe: Không tìm thấy ngôn ngữ với code = ${code}`);
    const field = args[0] as 'locale' | 'name' | undefined;
    if (field === 'name') return lang.name;
    return lang.locale;
  }

}
