import { google } from "googleapis";
import { createConfig } from "../../../utils/createConfig";
import axios from "axios";

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI,
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const messageId = searchParams.get("messageId");
    const url = `https://gmail.googleapis.com/gmail/v1/users/${email}/messages/${messageId}`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = createConfig(url, token);
    const response = await axios(config);
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
