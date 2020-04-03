export default class CommonTool {
  static isEmpty = (obj: any) => {
    return obj === null || obj === undefined || obj === ''
  }

  static isNonEmpty = (obj: any) => {
    return obj !== null && obj !== undefined && obj !== ''
  }

  static isNonEmptyList = (arr: any[]) => {
    let output = true

    if (arr) {
      if (arr.length >= 0) {
        arr.map((a) => {
          if (CommonTool.isEmpty(a)) {
            output = false
          }
        })
      } else output = false
    } else output = false

    return output
  }

  static toogle = (tag: string, className: string) => {
    const element = document.querySelector(tag)
    if (element) {
      element.classList.add(className)
    }
  }

  static getJwt = () => {
    return CommonTool.getCookie('jwt')
  }

  static getClickAction = (id: string) => {
    const element = CommonTool.getElement(id)
    if (element) {
      return element.click
    } else return null
  }

  static parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split('.')[1]))
    } catch (e) {
      return null
    }
  }

  static getCookie = (name: string) => {
    try {
      const value = ' ' + document.cookie
      const parts = value.split(' ' + name + '=')
      if (parts && parts.length === 2) {
        return parts.pop()!.split('').shift()
      } else {
        return ''
      }
    } catch (err) {
      return ''
    }
  }

  static getInput = (id: string): HTMLInputElement => {
    return CommonTool.getElement(id) as HTMLInputElement
  }

  static getElement = (id: string): HTMLElement => {
    return document.getElementById(id) as HTMLElement
  }

  static isPage = (path: string) => {
    return document.location.href.includes(path)
  }

  static getUrlAttributes = () => {
    let output: string[] = []

    const self = window.location.toString()
    const querystring = self.split('?')
    if (querystring.length > 1) {
      output = querystring[1].split('&')
    }

    return output
  }

  getUrlAttrVal = (name: string) => {
    let output = null
    const attrs = CommonTool.getUrlAttributes()

    for (const attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        const keyval = attrs[attr].split('=')
        if (keyval[0] === name) {
          output = keyval[1]
          break
        }
      }
    }

    return output
  }
}
