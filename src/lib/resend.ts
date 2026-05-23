import { Resend } from 'resend'

interface EmailParams {
  name: string
  email: string
  message: string
}

export async function sendEmail({ name, email, message }: EmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[Resend] No API key — logging fallback:')
    console.log('From: ' + name + ' <' + email + '>')
    console.log('Message: ' + message)
    return { success: true, fallback: true }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  const result = await resend.emails.send({
    from: 'Yusuf Portfolio <onboarding@resend.dev>',
    to: 'yusuf2000mm@gmail.com',
    subject: 'New message from ' + name + ' via portfolio',
    text: 'Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message,
    replyTo: email,
  })

  return { success: true, id: result.data?.id }
}
