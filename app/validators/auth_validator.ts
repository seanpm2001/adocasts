import vine from '@vinejs/vine'

export const usernameRule = vine
  .string()
  .maxLength(50)
  .minLength(3)
  .regex(/^[a-zA-Z0-9-_.]+$/)
  .notIn(['admin', 'super', 'power', 'adocasts', 'adocast', 'Adocasts', 'AdoCasts', 'AdoCast', 'Adocast', 'jagr', 'jagrco', '_jagr', '_jagrco', 'jagr_', 'jagrco_', 'jagr-co', 'moderator', 'public', 'dev', 'alpha', 'mail'])
  //.unique({ table: 'users', column: 'username', caseInsensitive: true }) // TODO

export const signInValidator = vine.compile(
  vine.object({
    uid: vine.string(),
    password: vine.string(),
    rememberMe: vine.accepted().optional(),
    forward: vine.string().optional(),
    action: vine.string().optional(),
    plan: vine.string().optional()//.unique({ table: 'plans', column: 'slug' }) // TODO
  })
)

export const signUpValidator = vine.compile(
  vine.object({
    username: usernameRule,
    email: vine.string().trim().email(),//.unique({ table: 'users', column: 'email' }), // TODO
    password: vine.string().minLength(8),
    forward: vine.string().optional(),
    plan: vine.string()/*.exists({ table: 'plans', column: 'slug' })*/.optional()
  })
)

export const passwordResetValidator = vine.compile(
  vine.object({
    token: vine.string(),
    email: vine.string().trim(),//.exists({ table: 'users', column: 'email' }), // TODO
    password: vine.string().minLength(8),
  })
)