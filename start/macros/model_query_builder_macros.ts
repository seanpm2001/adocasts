import States
import { ModelQueryBuilder } from "@adonisjs/lucid/orm"

declare module '@adonisjs/lucid/orm' {
  interface ModelQueryBuilder {
    wherePublic(): this
    whereTrue(column: string): this
    whereFalse(column: string): this
  }
}

ModelQueryBuilder.macro('wherePublic', function (this: ModelQueryBuilder) {
  return this.where({ stateId: 5 })
})

ModelQueryBuilder.macro('whereTrue', function (this: ModelQueryBuilder, column: string) {
  return this.where(column, true)
})

ModelQueryBuilder.macro('whereFalse', function (this: ModelQueryBuilder, column: string) {
  return this.where(column, false)
})