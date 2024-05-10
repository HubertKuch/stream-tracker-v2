import axios from "axios";

class TwitchWrapper {
  constructor(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async getToken() {
    const response = await axios.post(
      "https://id.twitch.tv/oauth2/token",
      null,
      {
        params: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: "client_credentials",
        },
      },
    );

    return response.data.access_token;
  }

  async getUser(username) {
    const token = await this.getToken();

    const response = await axios.get("https://api.twitch.tv/helix/streams", {
      headers: {
        "Client-ID": this.clientId,
        Authorization: `Bearer ${token}`,
      },
      params: {
        user_login: username,
      },
    });

    return response.data.data;
  }
}

export default TwitchWrapper;
