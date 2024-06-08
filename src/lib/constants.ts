const auth = {
  type: "OAuth2",
  user: "prathmeshdupare@gmail.com",
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
};

const mailOptions = {
  to: "prathmeshdupare2501@gmail.com",
  from: "prathmeshdupare@gmail.com",
  subject: "Gmail API using Node JS",
};

module.exports = {
  auth,
  mailOptions,
};
