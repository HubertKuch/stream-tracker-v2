import axios from "axios";
import * as cheerio from "cheerio";
import signale from "signale";

const axiosInstance = axios.create({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
  },

  validateStatus: () => {
    return true;
  },
});

const channelId = async (url) => {
  try {
    const ytChannelPageResponse = await axiosInstance.get(url);

    const $ = cheerio.load(ytChannelPageResponse.data);

    return $('link[rel="canonical"]')
      .attr("href")
      .replace("https://www.youtube.com/channel/", "");
  } catch (e) {
    signale.error("Error for getting youtube channel id %s", e.message);
    return null;
  }
};

export default channelId;
