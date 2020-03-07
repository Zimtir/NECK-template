import LoggerTool from './logger.tool'

export default class RequestTool {
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
