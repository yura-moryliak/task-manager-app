export interface DataCRUDInterface<T> {
  getList(): T[];
  create(...args: any[]): void;
  update(...args: any[]): void;
  delete(...arg: any[]): void;
  deleteAll(...args: any[]): void;
  deleteSelected(...args: any[]): void;
}
