export default class NullException implements Error {
  name: string
  message: string
  stack?: string | undefined

  constructor() {
    this.name = 'Null'
    this.message = 'Not found'
  }
}
