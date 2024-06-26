import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  salt_round: process.env.SALT_ROUND,
  jwt: {
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_expires_in: process.env.REFRESH_EXPIRES_IN,
    reset_pass_secret: process.env.RESET_PASS_TOKEN,
    reset_pass_expires_in: process.env.RESET_PASS_EXPIRES_IN,
  },
  reset_pass_link: process.env.RESET_PASS_LINK,
  email_sender_pass: process.env.EMAIL_SENDER_PASS,
  email: process.env.EMAIL,

  fileUpload: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  },

  payment: {
    store_id: process.env.STORE_ID,
    store_pass: process.env.STORE_PASS,
    payment_success_url: process.env.SUCCESS_URL,
    payment_failed_url: process.env.FAILED_URL,
    payment_cancel_url: process.env.CANCEL_URL,
    ssl_payment_url: process.env.SSL_PAYMENT_URL,
    validation_url: process.env.VALIDATION_URL,
  },
};
