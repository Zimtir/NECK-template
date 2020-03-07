export default interface IPersonRepository<T> {
  removeByUser: (user: number) => Promise<any>
  getAllByUser: (user: number) => Promise<T[]>
}
