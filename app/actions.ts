'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(formData: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    const { name, email, subject, message } = formData
    await resend.emails.send({
      from: 'AWS Student Builder Group <noreply@rst.aws-uok.com>',
      to: 'awscloudclub@kln.ac.lk',
      subject: `New Contact Form Submission: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

