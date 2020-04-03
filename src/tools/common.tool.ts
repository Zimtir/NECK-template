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
    let element = document.querySelector(tag)
    if (element) {
      element.classList.add(className)
    }
  }

  static getJwt = () => {
    return CommonTool.getCookie('jwt')
  }

  static getClickAction = (id: string) => {
    let element = CommonTool.getElement(id)
    if (element) {
      return element.click
    } else return () => {}
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
      let value = ' ' + document.cookie
      let parts = value.split(' ' + name + '=')
      if (parts && parts.length == 2) {
        return parts.pop()!.split('').shift()
      } else {
        return ''
      }
    } catch (err) {
      return ''
    }
  }

  static getInput = (name: string): HTMLInputElement => {
    return <HTMLInputElement>CommonTool.getElement(name)
  }

  static getElement = (name: string): HTMLElement => {
    return <HTMLElement>document.getElementById(name)
  }

  static isPage = (path: string) => {
    return document.location.href.includes(path)
  }

  static getUrlAttributes = () => {
    let output: string[] = []

    let self = window.location.toString()
    let querystring = self.split('?')
    if (querystring.length > 1) {
      output = querystring[1].split('&')
    }

    return output
  }

  getUrlAttrVal = (name: string) => {
    let output = null
    let attrs = CommonTool.getUrlAttributes()

    for (let attr in attrs) {
      let keyval = attrs[attr].split('=')
      if (keyval[0] === name) {
        output = keyval[1]
        break
      }
    }

    return output
  }
}
