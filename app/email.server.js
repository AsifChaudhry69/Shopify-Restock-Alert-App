import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST ";
const SMTP_PORT = Number(process.env.SMTP_PORT );
const SMTP_USER = process.env.SMTP_USER ;
const SMTP_PASS = process.env.SMTP_PASS ;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

export async function sendRestockEmail(email, productId, shop, productTitle, productUrl, storeName) {
  const url = productUrl || `https://${shop}/products/${productId}`;
  const title = productTitle || "Your item";
  const store = storeName || shop;

  console.log(`Attempting to send email to ${email}...`);

  const info = await transporter.sendMail({
    from: '"Restock Alerts" <asifshoaib625@gmail.com>',
    to: email,
    subject: `🛍️ ${title} is back in stock at ${store}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Great news! 🎉</h2>
        <p style="color: #555; font-size: 16px;">
          <strong>${title}</strong> is back in stock at <strong>${store}</strong>!
        </p>
        <p style="color: #555;">Don't wait — it might sell out again.</p>
        <a href="${url}"
           style="display:inline-block; background:#000; color:#fff;
                  padding:14px 28px; text-decoration:none;
                  border-radius:6px; font-size:16px; margin:20px 0;">
          Shop Now →
        </a>
        <hr style="border:none; border-top:1px solid #eee; margin:20px 0;">
        <p style="color: #999; font-size: 12px;">
          You received this email because you signed up for restock alerts at ${store}.
        </p>
      </div>
    `,
  });

  console.log("✅ Email sent! Message ID:", info.messageId);
}