export default interface IExpressInit {
  app: any
  installAfterRoutes: (port?: string, callback?: () => void) => void
}
