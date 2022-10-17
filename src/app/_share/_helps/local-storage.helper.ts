export class LocalStorageHelper {
    
  public static set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public static get(key: string) {
    return localStorage.getItem(key);
  }

  public static remove(key: string) {
    localStorage.removeItem(key);
  }
}