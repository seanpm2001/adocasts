import CollectionTypes from "#enums/collection_types";
import States from "#enums/states";
import Collection from "#models/collection";
import User from "#models/user";
import BaseBuilder from "./base_builder.js";

export default class CollectionBuilder extends BaseBuilder<typeof Collection, Collection> {
  constructor(protected user: User | undefined = undefined) {
    super(Collection)
  }

  public static new(user: User | undefined = undefined) {
    return new CollectionBuilder(user)
  }

  public display() {
    this.query.preload('asset')
    this
      .public()
      .withTaxonomies()
      .withPostCount()
      .withTotalMinutes()

    return this
  }

  public root() {
    this.query.whereNull('parentId')
    return this
  }

  public series() {
    this.query.where('collectionTypeId', CollectionTypes.SERIES)
    return this
  }

  public path() {
    this.query.where('collectionTypeId', CollectionTypes.PATH)
    return this
  }

  public public() {
    this.whereHasPosts()
    this.query.where({ stateId: States.PUBLIC })
    return this
  }

  public whereHasPosts() {
    this.query.whereHas('postsFlattened', query => query
      .apply(scope => scope.published())
    )
    return this
  }

  public withTaxonomies() {
    this.query.preload('taxonomies', query => query
      .groupOrderBy('sort_order', 'asc').groupLimit(3)
    )
    return this
  }

  public withPosts(
    orderBy: 'pivot_sort_order' | 'pivot_root_sort_order' = 'pivot_sort_order',
    direction: 'asc' | 'desc' = 'asc',
    limit: number | undefined = undefined, 
  ) {
    this.query
      .preload('postsFlattened', query => query
        .apply(scope => scope.forDisplay())
        .orderBy(orderBy, direction)
        .if(limit, query => query.groupLimit(limit!))
        .if(this.user, query => query
          .preload('progressionHistory', query => query
            .where({ userId: this.user!.id })
            .orderBy('updated_at', 'desc')
          )
        )
      )
      .preload('posts', query => query
        .apply(scope => scope.forDisplay())
        .orderBy(orderBy, direction)
        .if(this.user, query => query
          .preload('progressionHistory', query => query
            .where({ userId: this.user!.id })
            .orderBy('updated_at', 'desc')
          )
        )
      )
    return this
  }

  public withChildren() {
    this.query
        .preload('children', query => query
        .where('stateId', States.PUBLIC)
        .whereHas('posts', query => query.apply(scope => scope.published()))
        .preload('posts', query => query
          .apply(scope => scope.forCollectionDisplay())
          .if(this.user, query => query
            .preload('progressionHistory', query => query
              .where({ userId: this.user!.id })
              .orderBy('updated_at', 'desc')
            )
          )
        )
      )
    return this
  }

  public withPostCount() {
    this.query.withCount('postsFlattened', query => query
      .apply(scope => scope.published())
    )
    return this
  }

  public withTotalMinutes() {
    this.query.withAggregate('postsFlattened', query => query
      .apply(scope => scope.published())
      .sum('video_seconds')
      .as('videoSecondsSum')
    )
    return this
  }

  public orderLatestUpdated() {
    this.query
      .apply(scope => scope.withPostLatestPublished())
      .orderBy('latest_publish_at', 'desc')
      .select(['collections.*'])

    return this
  }
}