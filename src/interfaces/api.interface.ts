export default interface IApi {
  enabled: boolean
  auth: boolean
  path: string
  type: string
  option?: any
  routeCallback: (db: any, req: any, res: any) => void
}
