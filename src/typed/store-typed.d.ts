export interface TypedElectronStoreApi {
  set: (key: string, value: any) => Promise<void | true>;
  get: <T = any>(key: string, defaultValue?: T) => Promise<T>;
  remove: (key: string) => Promise<void | true>;
  clear: () => Promise<void | true>;
}
