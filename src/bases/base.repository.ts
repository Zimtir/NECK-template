import IRepository from '../interfaces/repository.interface'
import IPersonRepository from '../interfaces/person.repository.interface'

export default class BaseRepository<T> implements IRepository<T>, IPersonRepository<T> {
  db: any

  public constructor(db: any) {
    this.db = db
  }

  public getAll = async () => {
    return this.db.findAll({ raw: true })
  }

  public get = async (id: number) => {
    return this.db.findOne({
      where: {
        id,
      },
    })
  }

  public add = async (item: T) => {
    return this.db.create(item)
  }

  public update = async (item: T) => {
    return this.db.update(item)
  }

  public remove = async (id: number) => {
    return this.db.destroy({
      where: {
        id,
      },
    })
  }

  public removeByUser = async (user: number) => {
    return this.db.destroy({
      where: {
        user,
      },
    })
  }

  public getByUser = async (user: number) => {
    return this.db.findOne({
      where: {
        user,
      },
    })
  }

  public getAllByUser = async (user: number) => {
    return this.db.findAll({
      where: {
        user,
      },
    })
  }
}
