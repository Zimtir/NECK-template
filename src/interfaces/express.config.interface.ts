export default interface IExpressConfiguration {
  bodyParser: boolean
  routeView: boolean
  dotenv: {
    enabled: boolean
    path: string
  }
  handleErrors: boolean
  morgan: boolean
  listen: boolean
  static: {
    enabled: boolean
    path: string
  }
  compression: {
    enabled: boolean
    threshold: number
  }
  sapper: boolean
}
