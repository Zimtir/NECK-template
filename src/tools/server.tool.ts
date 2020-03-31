import LoggerTool from './logger.tool'
import CommonTool from './common.tool'
import crypto from 'crypto'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import session from 'express-session'
import jsonwebtoken from 'jsonwebtoken'
import express from 'express'
import morgan from 'morgan'
import IUser from '../interfaces/user.interface'
import IJWT from '../interfaces/jwt.interface'
import RequestTool from './request.tool'
import IExpressConfiguration from '../interfaces/express.config.interface'
import IExpressInit from '../interfaces/express.init.interface'

export default class ServerTool {
  static generatePayload(key: string, token: string, hmac: string, user: IUser) {
    if (CommonTool.isNonEmptyList([key, token, hmac, user])) {
      if (CommonTool.isNonEmpty(user.email)) {
        const hexToken = Buffer.from(token, 'hex')
        const hexHmac = Buffer.from(hmac, 'hex')
        const hexSecret = Buffer.from(key, 'hex')

        const expectedHmac = crypto
          .createHmac('sha256', hexSecret)
          .update(hexToken)
          .digest('hex')

        LoggerTool.log('hexHmac', hexHmac)
        LoggerTool.log('expectedHmac', expectedHmac)

        if (hmac === expectedHmac) {
          const payloadJson = JSON.stringify({
            token,
            email: user.email,
            name: user.name,
            photo: user.photo,
          })

          const outHmac = crypto
            .createHmac('sha256', hexSecret)
            .update(payloadJson, 'utf8')
            .digest('hex')

          const payloadHex = Buffer.from(payloadJson, 'utf8').toString('hex')

          return {
            hmac: outHmac,
            payload: payloadHex,
          }
        }
      }
    }
    return null
  }

  static setOrigins(app: any, origins: string[]) {
    app.use((req: any, res: any, next: any) => {
      for (const origin of origins) {
        try {
          if (req.headers.origin.indexOf(origin) > -1) {
            res.header('Access-Control-Allow-Origin', req.headers.origin)
          }
        } catch (err) {
          LoggerTool.log('Header not contains origin', origin)
        }
      }

      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      next()
    })
  }

  static initExpress = (configuration: IExpressConfiguration): IExpressInit => {
    if (configuration.dotenv.enabled) {
      require('dotenv').config({ path: configuration.dotenv.path })
    }

    const app: any = express()

    if (configuration.morgan) {
      app.use(morgan('combined'))
    }

    if (configuration.bodyParser) {
      app.use(bodyParser.json())
      app.use(bodyParser.urlencoded({ extended: true }))
    }

    return {
      app,
      installAfterRoutes: (port: string = '', callback: any) => {
        if (configuration.routeView) {
          const showRoutes = require('express-list-endpoints')
          LoggerTool.log(showRoutes(app))
        }
        if (configuration.handleErrors) {
          ServerTool.handleAppErrors(app)
        }

        if (configuration.listen) {
          app.listen(port, callback)
        }
      },
    }
  }

  static initSession = (app: any, secret: string, expiration: number) => {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    app.use(cookieParser())

    app.use(
      session({
        secret,
        resave: true,
        saveUninitialized: true,
        cookie: {
          maxAge: expiration,
        },
      }),
    )

    app.use(passport.initialize())
    app.use(passport.session())
  }

  static generateAccessToken = (user: IUser, config: IJWT) => {
    const token = jsonwebtoken.sign(
      {
        exp: config.expiration,
        data: JSON.parse(JSON.stringify(user)),
      },
      config.key,
    )

    return token
  }

  static parseJwtToken = (request: any, config: IJWT) => {
    try {
      let token = ''

      if (CommonTool.isNonEmpty(request.query.jwt)) {
        token = request.query.jwt
      } else if (CommonTool.isNonEmpty(request.cookies[config.cookieName])) {
        token = request.cookies[config.cookieName]
      } else {
        LoggerTool.log('JWT token not set')
        return undefined
      }

      return jsonwebtoken.verify(token, config.key)
    } catch (err) {
      LoggerTool.log(`can't parse token`)
      return undefined
    }
  }

  static checkParams = (response: any, params: any[]) => {
    const output = CommonTool.isNonEmptyList(params)

    if (!output) {
      RequestTool.decline(response)
    }

    return output
  }

  static sendStatus(promise: Promise<any>, res: any) {
    promise
      .then((r: any) => {
        LoggerTool.log(r)
        res.send(JSON.stringify(r))
      })
      .catch((err: any) => {
        LoggerTool.log('error at send status')
        LoggerTool.log(err)
        RequestTool.decline(res)
      })
  }

  static withoutAuth = (req: any, res: any, next: any) => {
    LoggerTool.log('withoutAuth')
    next()
  }

  static ensureAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next()
    }
    ServerTool.needLogin(res)
  }

  static needLogin = (res: any) => {
    res.send(null)
  }

  static handleServerErrors = (server: any) => {
    server.on('listening', () => {
      const addr = server.address()
      const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port

      LoggerTool.log(`server listen at ${bind}`)
    })
  }

  static handleAppErrors = (app: any) => {
    app.use((req: any, res: any, next: any) => {
      const err = new Error('Not Found')
      next(err)
    })

    app.use((err: any, req: any, res: any, next: any) => {
      res.locals.message = err.message
      res.locals.error = {}
      res.status(err.status || 500)
      res.json(err)
      LoggerTool.log(err, next)
    })
  }
}
