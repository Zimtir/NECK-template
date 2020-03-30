export default interface IExpressConfiguration {
  bodyParser: boolean
  routeView: boolean
  dotenv: {
    enabled: boolean
    path: string
  }
  handleErrors: boolean
  morgan: boolean
  listen: {
    enableed: boolean
    port: number
    callback: () => void
  }
}
