import { SendEmailProvider } from '../provider.js'

const EMAIL = process.env.EMAIL
if (!EMAIL) throw new Error('Set EMAIL environment variable')

new SendEmailProvider().SendOneTimePassword({
	email: EMAIL,
	oneTimePassword: { whenCreated: 0, code: '000000' },
	language: 'en',
})
