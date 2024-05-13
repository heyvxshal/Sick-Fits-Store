import { createTransport, getTestMessageUrl } from "nodemailer";

const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function makeEmail(text: string): string {
  return `
        <div style="
            border: 1px solid black;
            padding: 20px;
            font-family: sans-serif;
            line-height: 2 ;
            font-height: 20px;
        ">
        <h2>Hello There!</h2>
        <p>${text}</p>
        <p>Sick Fits Store 👟</p>
        </div>
    `;
}

export async function sendPasswordResetEmail(
  resetToken: string,
  to: string
): Promise<void> {
  // Email the use a token
  const info = await transport.sendMail({
    to,
    from: "test@example.com",
    subject: "Your password reset token!",
    html: makeEmail(`Your password Reset token is here
    
    
    <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click Here to reset</a>
    `),
  });

  if (process.env.MAIL_USER.includes("ethereal.email")) {
    console.log(`✉️ Message Sent! Preview it at ${getTestMessageUrl(info)}`);
  }
}
