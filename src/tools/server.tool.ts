import LoggerTool from './logger.tool'
import CommonTool from './common.tool'
import crypto from 'crypto'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import session from 'express-session'
import jsonwebtoken from 'jsonwebtoken'

import IUser from '../interfaces/user.interface'
import IJWT from '../interfaces/jwt.interface'

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
          maxAge: expiration
        }
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
}
