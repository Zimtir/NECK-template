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
        arr.map(a => {
          if (CommonTool.isEmpty(a)) {
            output = false
          }
        })
      } else output = false
    } else output = false

    return output
  }
}
