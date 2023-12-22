import env from '#start/env'
import { Bucket, DeleteFileOptions, DownloadOptions, SaveOptions, Storage } from '@google-cloud/storage'
import { ImageOptions } from './asset_service.js'
import sharp, { AvailableFormatInfo, FormatEnum } from 'sharp'

class StorageService {
  private bucket: Bucket

  constructor() {
    const storage = new Storage({ keyFilename: env.get('GCS_KEY_FILENAME') })
    this.bucket = storage.bucket(env.get('GCS_BUCKET'))
  }

  public async exists(filename: string) {
    const exists = await this.bucket.file(filename).exists()
    return exists.at(0)
  }

  public get(filename: string) {
    return this.bucket.file(filename).createReadStream()
  }

  public async url(filename: string) {
    return this.bucket.file(filename).publicUrl()
  }

  public async download(filename: string, options?: DownloadOptions) {
    return this.bucket.file(filename).download(options)
  }

  public async store(filename: string, data: Buffer, options?: SaveOptions) {
    const file = this.bucket.file(filename)
    await file.save(data, options)
  }

  public async destroy(filename: string, options: DeleteFileOptions = { ignoreNotFound: true }) {
    return this.bucket.file(filename).delete(options)
  }

  public alter(fromFilename: string, toFilename: string, options: ImageOptions) {
    if (options.format === 'svg+xml') return this.get(fromFilename)
    
    const writeStream = this.bucket.file(toFilename).createWriteStream({ contentType: `image/${options.format}` })
    const pipeline = sharp()
    const toOptions = options.quality ? { quality: options.quality } : {};

    if (options.width) {
      pipeline.resize(options.width)
    }

    if (options.format) {
      pipeline.toFormat(options.format as keyof FormatEnum | AvailableFormatInfo, toOptions)
    }

    if (options.blur) {
      pipeline.blur(options.blur)
    }

    pipeline.pipe(writeStream)

    this.bucket.file(fromFilename).createReadStream().pipe(pipeline)

    return new Promise((resolve, reject) => writeStream.on('finish', resolve).on('error', reject))
  }
}

const storage = new StorageService()
export default storage