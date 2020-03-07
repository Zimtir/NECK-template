import SocialEnum from '../enums/social.enum'

export default interface IStrategy {
  enabled: boolean
  name: string
  callback: string
  credentials: any
  scope: any
  passport: string
  route: string
  social: SocialEnum
}
