export default interface IRepository<T> {
  db: any

  getAll: () => Promise<T[]>
  get: (id: number) => Promise<T>
  add: (item: T) => Promise<any>
  remove: (id: number) => Promise<any>
  update: (item: T) => Promise<T>
}
