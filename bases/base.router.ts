import IRepository from '../interfaces/repository.interface'
import EmptyRepository from '../empties/empty.repository'
import IDatabase from '../interfaces/db.interface'

export default class BaseRouter<T> {
  public constructor(db: IDatabase) {
    this.db = db
    this.repository = new EmptyRepository(db)
  }

  db: IDatabase
  repository: IRepository<T>
}
