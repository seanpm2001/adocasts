import PostTypes from "#enums/post_types";
import Post from "#models/post";
import Taxonomy from "#models/taxonomy";
import BaseBuilder from "./base_builder.js";

export default class PostBuilder extends BaseBuilder<typeof Post, Post> {
  constructor() {
    super(Post)
  }

  public static new() {
    return new PostBuilder()
  }

  public display() {
    this.orderPublished()
    this.query.apply(scope => scope.forDisplay())
    return this
  }

  public published() {
    this.query.apply(scope => scope.published())
    return this
  }

  public whereLesson() {
    this.query.whereIn('postTypeId', [PostTypes.LESSON, PostTypes.LIVESTREAM])
    return this
  }

  public whereBlog() {
    this.query.whereIn('postTypeId', [PostTypes.BLOG, PostTypes.NEWS])
    return this
  }

  public whereType(postTypeIds: PostTypes[] | PostTypes) {
    this.query.if(Array.isArray(postTypeIds),
      query => query.where(q => (<PostTypes[]>postTypeIds).map(postTypeId => q.orWhere({ postTypeId }))),
      query => query.where({ postTypeId: postTypeIds })
    )
    return this
  }

  public whereHasTaxonomy(taxonomy: Taxonomy) {
    this.query.whereHas('taxonomies', query => query.where('taxonomies.id', taxonomy.id))
    return this
  }

  public whereHasTaxonomies(taxonomies: Taxonomy[] | undefined = undefined) {
    this.query
      .if(taxonomies, 
        query => query.whereHas('taxonomies', query => query.whereIn('taxonomies.id', taxonomies!.map(tax => tax.id))),
        query => query.whereHas('taxonomies', query => query.apply(scope => scope.hasContent()))
      )
    return this
  }

  public orderPublished() {
    this.query.orderBy([
      { column: 'publishAt', order: 'desc' },
      { column: 'createdAt', order: 'desc' }
    ])
    return this
  }
}