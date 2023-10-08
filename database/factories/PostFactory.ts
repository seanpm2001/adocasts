import Post from 'App/Models/Post'
import Factory from '@ioc:Adonis/Lucid/Factory'
import States from 'App/Enums/States'
import { UserFactory } from './UserFactory'
import { DateTime } from 'luxon'
import { CommentFactory } from './CommentFactory'
import PaywallTypes from 'App/Enums/PaywallTypes'
import VideoTypes from 'App/Enums/VideoTypes'
import UtilityService from 'App/Services/UtilityService'
import { AssetFactory } from './AssetFactory'

const youtubeUrls = [
  'https://www.youtube.com/watch?v=Npn-2qweD5k',
  'https://www.youtube.com/watch?v=q0I3bzYUE1A',
  'https://www.youtube.com/watch?v=zvK4-suEKnM',
  'https://www.youtube.com/watch?v=0AGHmWdnsVM',
  'https://www.youtube.com/watch?v=NdLzhFINrW4',
  'https://www.youtube.com/watch?v=KfkBAYgwAxA',
  'https://www.youtube.com/watch?v=7HyCMmjO9zQ',
  'https://www.youtube.com/watch?v=BPjvak_kB3U',
  'https://www.youtube.com/watch?v=OieU-z4orBk'
]

export const PostFactory = Factory
  .define(Post, ({ faker }) => ({
    title: faker.word.words(5),
    description: faker.lorem.sentences(2),
    body: faker.lorem.paragraphs(5),
    stateId: States.PUBLIC,
    publishAt: DateTime.fromJSDate(faker.date.past()),
  }))
  .state('futureDated', (post, { faker }) => {
    post.publishAt = DateTime.fromJSDate(faker.date.future())
  })
  .state('draft', (post) => post.stateId = States.DRAFT)
  .state('unlisted', (post) => post.stateId = States.UNLISTED)
  .state('private', (post) => post.stateId = States.PRIVATE)
  .state('paywalled', (post) => post.paywallTypeId = PaywallTypes.FULL)
  .state('timedPaywall', (post) => post.paywallTypeId = PaywallTypes.DELAYED_RELEASE)
  .state('video', (post) => {
    post.videoTypeId = VideoTypes.YOUTUBE
    post.videoUrl = UtilityService.getRandom(youtubeUrls)
  })
  .relation('authors', () => UserFactory)
  .relation('comments', () => CommentFactory)
  .relation('assets', () => AssetFactory)
  .build()
