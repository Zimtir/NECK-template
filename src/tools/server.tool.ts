import LoggerTool from './logger.tool'
import CommonTool from './common.tool'
import crypto from 'crypto'
import IUser from '../interfaces/user.interface'

export default class ServerTool {
  static generatePayload(key: string, token: string, hmac: string, user: IUser) {
    if (CommonTool.isNonEmptyList([key, token, hmac, user])) {
      if (CommonTool.isNonEmpty(user.email)) {
        const hexToken = Buffer.from(token, 'hex').toString()
        const hexHmac = Buffer.from(hmac, 'hex')
        const hexSecret = Buffer.from(key, 'hex')

        const expectedHmac = crypto
          .createHmac('sha256', hexSecret)
          .update(hexToken, 'utf8')
          .digest('hex')

        LoggerTool.log('hexHmac', hexHmac)
        LoggerTool.log('expectedHmac', expectedHmac)

        if (hmac === expectedHmac) {
          var payloadJson = JSON.stringify({
            token: token,
            email: user.email,
            name: user.name,
            photo: user.photo,
          })

          const outHmac = crypto
            .createHmac('sha256', hexSecret)
            .update(payloadJson, 'utf8')
            .digest('hex')

          LoggerTool.log('outHmac', outHmac)

          const payloadHex = Buffer.from(payloadJson, 'utf8').toString('hex')

          LoggerTool.log('payloadHex', payloadHex)

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
      for (var i = 0; i < origins.length; i++) {
        var origin = origins[i]
        try {
          if (req.headers.origin.indexOf(origin) > -1) {
            res.header('Access-Control-Allow-Origin', req.headers.origin)
          }
        } catch (err) {
          LoggerTool.log('Header not contains origins')
        }
      }

      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      next()
    })
  }
}