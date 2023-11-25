import CollectionBuilder from "#builders/collection_builder"

export default class CollectionService {
  /**
   * Returns a new instance of the collection builder
   * @returns 
   */
  public builder() {
    return new CollectionBuilder()
  }

  /**
   * Returns the number of public root series
   * @returns 
   */
  public async getSeriesCount() {
    return this
      .builder()
      .series()
      .public()
      .root()
      .count()
  }

  /**
   * gets the latest updated series collections
   * @param limit
   * @param excludeIds
   * @param withPosts
   * @param postLimit
   * @returns
   */
  public async getLastUpdated(limit: number = 4, withPosts: boolean = true, excludeIds: number[] = [], postLimit: number = 5) {
    return this.queryGetLastUpdated(withPosts, excludeIds, postLimit).limit(limit)
  }

  /**
   * returns query used to get the latest updated series collections
   * @param limit
   * @param excludeIds
   * @param withPosts
   * @param postLimit
   * @returns
   */
  private queryGetLastUpdated(withPosts: boolean = true, excludeIds: number[] = [], postLimit: number = 5) {
    return CollectionBuilder.new()
      .if(withPosts, (builder) => builder.withPosts(postLimit, 'pivot_root_sort_order', 'desc'))
      .if(excludeIds, (builder) => builder.exclude(excludeIds))
      .root()
      .display()
      .orderLatestUpdated()
  }
}