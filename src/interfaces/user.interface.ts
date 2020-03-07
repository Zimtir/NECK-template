import ISocial from './social.interface'

export default interface IUser {
  id: number
  name: string
  social: ISocial
  created: Date
}
