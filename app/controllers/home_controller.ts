import CollectionService from '#services/collection_service'
import PostService from '#services/post_service'
import TaxonomyService from '#services/taxonomy_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class HomeController {
  constructor(
    protected collectionService: CollectionService,
    protected taxonomyService: TaxonomyService,
    protected postService: PostService
  ) {}

  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    const series = await this.collectionService.getLastUpdated(8, true)
    const topics = await this.taxonomyService.getList()
    const lessons = await this.postService.getLatestLessons(12)
    const blogs = await this.postService.getLatestBlogs(4)
    const snippets = await this.postService.getLatestSnippets(4)

    return view.render('pages/home', { 
      series, 
      topics, 
      lessons,
      blogs,
      snippets
    })
  }
}