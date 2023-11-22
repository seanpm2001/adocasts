import { DateTime } from 'luxon'
import { column } from '@adonisjs/lucid/orm'
import AppBaseModel from '#models/app_base_model'
import AuthAttemptService from '#services/auth_attempt_service'

export default class AuthAttempt extends AppBaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare uid: string

  @column()
  declare purposeId: number

  @column.dateTime()
  declare deletedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  public static async allows(uid: string) {
    return AuthAttemptService.hasAttempts(uid)
  }

  public static async disallows(uid: string) {
    return !await AuthAttemptService.hasAttempts(uid)
  }

  public static async clear(uid: string) {
    return AuthAttemptService.clearAttempts(uid)
  }

  public static async recordBadLogin(uid: string) {
    return AuthAttemptService.recordLoginAttempt(uid)
  }

  public static async recordBadEmailChange(uid: string) {
    return AuthAttemptService.recordChangeEmailAttempt(uid)
  }
}
