import * as core from 'express-serve-static-core'

export default interface IExpressInit {
  app: core.Express
  installAfterRoutes: () => void
}
