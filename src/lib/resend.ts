import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailParams {
  name: string
  email: string
  message: string
}

export async function sendEmail({ name, email, message }: EmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[Resend] RESEND_API_KEY not set — logging instead:')
    console.log(`From: ${name} <${email}>`)
    console.log(`Message: ${message}`)
    return { success: true, fallback: true }
  }

  await resend.emails.send({
    from: 'Yusuf Portfolio <onboarding@resend.dev>',
    to: 'yusuf2000mm@gmail.com',
    subject: 'New message from ' + name + ' via portfolio',
    text: 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message,
    replyTo: email,
  })

  return { success: true }
}
