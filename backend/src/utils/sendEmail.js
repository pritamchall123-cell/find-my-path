const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY is not set');
  }

  const senderEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'FindMyPath', email: senderEmail },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Brevo email error:', response.status, errorText);
      throw new Error(`Email send failed (${response.status})`);
    }
  } finally {
    clearTimeout(timeout);
  }
};

module.exports = sendEmail;