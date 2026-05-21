import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const ses = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
})

interface EmailParams {
  name: string
  email: string
  message: string
}

export async function sendEmail({ name, email, message }: EmailParams) {
  const from = process.env.SES_FROM_EMAIL
  const to = process.env.SES_TO_EMAIL

  if (!from || !to) {
    console.log('[SES] Missing SES_FROM_EMAIL or SES_TO_EMAIL — logging instead:')
    console.log(`From: ${name} <${email}>`)
    console.log(`Message: ${message}`)
    return { success: true, fallback: true }
  }

  const command = new SendEmailCommand({
    Source: from,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: 'Portfolio Contact: ' + name },
      Body: {
        Text: {
          Data: 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message,
        },
      },
    },
    ReplyToAddresses: [email],
  })

  await ses.send(command)
  return { success: true }
}
