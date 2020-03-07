import IRepository from '../interfaces/repository.interface'
import IPersonRepository from '../interfaces/person.repository.interface'
import NullException from '../exceptions/null.exception'

export default class EmptyRepository<T> implements IRepository<T>, IPersonRepository<T> {
  db: any

  public constructor(db: any) {
    this.db = db
  }

  public getAll = async () => {
    throw NullException
  }

  public get = async (id: number) => {
    throw NullException
  }

  public add = async (item: T) => {
    throw NullException
  }

  public update = async (item: T) => {
    throw NullException
  }

  public remove = async (id: number) => {
    throw NullException
  }

  public removeByUser = async (user: number) => {
    throw NullException
  }

  public getByUser = async (user: number) => {
    throw NullException
  }

  public getAllByUser = async (user: number) => {
    throw NullException
  }
}
