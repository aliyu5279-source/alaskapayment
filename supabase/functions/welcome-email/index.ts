import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const payload = await req.json()
  console.log('📩 New signup payload:', payload)

  const user = payload?.record
  if (!user || !user.email) {
    return new Response(JSON.stringify({ error: 'No user data found' }), { status: 400 })
  }

  const email = user.email
  const subject = 'Welcome to AlaskaPay!'
  const message = \
  Hi there 👋,

  Welcome to AlaskaPay — your seamless payment experience starts here!

  We're thrilled to have you onboard. You can now log in and explore your dashboard.

  💳 AlaskaPay Team
  \

  // Send the email via Gmail SMTP Relay API
  const username = 'alaskapaynotification@gmail.com'
  const password = 'vfnt wmuf yvjx wnba'

  try {
    const smtpResponse = await fetch('https://smtp-relay.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': password,
      },
      body: JSON.stringify({
        sender: { email: username, name: 'AlaskaPay Team' },
        to: [{ email }],
        subject,
        textContent: message,
      }),
    })

    if (!smtpResponse.ok) {
      throw new Error('SMTP failed: ' + smtpResponse.statusText)
    }

    console.log('✅ Welcome email sent to', email)
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    console.error('❌ Email send error:', err.message)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
