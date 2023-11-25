import { LucidModel, LucidRow, ModelQueryBuilderContract } from "@adonisjs/lucid/types/model"

export default class BaseBuilder<Model extends LucidModel, Record extends LucidRow> {
  public query: ModelQueryBuilderContract<Model, Record>

  constructor(protected model: Model) {
    this.query = model.query()
  }

  public if(condition: any, cb: (self: this) => this) {
    if (condition) {
      return cb(this)
    }
    return this
  }

  public limit(limit: number) {
    this.query.limit(limit)
    return this
  }

  public exclude(values: any[], column: string = 'id') {
    this.query.whereNotIn(column, values)
    return this
  }

  public async count(column: string = '*') {
    const result = await this.query.count(column, 'total').first()
    return result?.$extras.total ?? 0
  }

  public async sum(column: string) {
    const result = await this.query.sum(column, 'sum').first()
    return result?.$extras.sum ?? 0
  }

  public then(
    onfulfilled?: ((value: Record[]) => Record[] | PromiseLike<Record[]>) | null | undefined,
    onrejected?: ((reason: any) => PromiseLike<never>) | null | undefined
  ) {
    return this.query.then(onfulfilled, onrejected)
  }
}
