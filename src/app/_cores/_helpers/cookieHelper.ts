import { environment } from "environments/environment";

export class cookieHelper {
  private cookieStore: any = {};

  constructor() {
    this.parseCookies(document.cookie);
  }

  public parseCookies(cookies = document.cookie) {
    this.cookieStore = {};
    if (!!cookies === false) { return; }
    const cookiesArr = cookies.split(';');
    for (const cookie of cookiesArr) {
      const cookieArr = cookie.split('=');
      this.cookieStore[cookieArr[0].trim()] = cookieArr[1];
    }
  }

  get(key: string) {
    this.parseCookies();
    return !!this.cookieStore[key] ? this.cookieStore[key] : null;
  }

  remove(key: string) {
    document.cookie = `${key}=;;domain=${environment.DOMAIN_SHARING};expires=Thu, 1 jan 1990 12:00:00 UTC; path=/`;
  }

  /**
   * Set cookie
   * @param key Key name of cookie
   * @param value Value string for cookie
   * @param domain Domain to apply
   * @param expires Expires time: Date string format
   * @param maxAge Others way to set expires and cookie will be deleted
   */
  set(key: string, value: string, domain?: string, path?: string, expires?: string, maxAge?: number) {
    // eslint-disable-next-line max-len
    const _cookieStr = `${key}=${(value || '')}${domain ? ';domain=' + domain : ''}${expires ? ';max-age=' + expires : ''}${maxAge ? ';max-age=' + maxAge : ''}${path ? ';path=' + path : ';path=/;'}`;
    document.cookie = _cookieStr;
  }


  /**
   * Set with default domain
   * @param key Key name of cookie
   * @param value Value string for cookie
   * @param expires Expires time: Date string format
   * @param maxAge Others way to set expires and cookie will be deleted
   * */
  setWithDefault(key: string, value: string, path?: string, expires?: string, maxAge?: number) {
    // eslint-disable-next-line max-len
    const _cookieStr = `${key}=${(value || '')};domain=${environment.DOMAIN_SHARING}${expires ? ';max-age=' + expires : ''}${maxAge ? ';max-age=' + maxAge : ''}${path ? ';path=' + path : ';path=/;'}`;
    document.cookie = _cookieStr;
  }
}
