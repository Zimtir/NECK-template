import LoggerTool from './logger.tool'
import CommonTool from './common.tool'

export default class RequestTool {
  static decline = (res: any, status: number = 503) => {
    res.sendStatus(status)
  }

  static checkParams(res: any, params: any[]) {
    const output = CommonTool.isNonEmptyList(params)

    if (!output) {
      RequestTool.decline(res)
    }

    return output
  }

  static fetchJson = async (url: string, noCors: boolean = false) => {
    try {
      let fetchResponse: Response

      if (noCors) {
        fetchResponse = await fetch(url, { mode: 'no-cors' })
      } else {
        fetchResponse = await fetch(url)
      }

      const data = await fetchResponse.json()
      return data
    } catch (e) {
      LoggerTool.log(e)
      return null
    }
  }

  static fetchPostJson = async (url: string, params: any) => {
    try {
      const fetchResponse = await fetch(url, RequestTool.generatePostParams(params))
      const data = await fetchResponse.json()
      return data
    } catch (e) {
      LoggerTool.log(e)
      return null
    }
  }

  static generatePostParams = (param: any) => {
    return {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(param),
    }
  }
}
