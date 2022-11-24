const { createHash } = require("crypto");
const axios = require('axios');

class RaycloudService {
  constructor() {
  }

  static createMD5Hash(signatureComposition) {
    return createHash("md5")
      .update(signatureComposition)
      .digest("hex")
      .toUpperCase();
  }

  static getCurrentTime(format) {
    const hour = new Date().toLocaleString("en-US", {timeZone: "Asia/Shanghai", hour: "2-digit"}).replace(/\s[AP]M/g, "")
    const minute = new Date().toLocaleString("en-US", {timeZone: "Asia/Shanghai", minute: "2-digit"})
    const second = new Date().toLocaleString("en-US", {timeZone: "Asia/Shanghai", second: "2-digit"})

    const year = new Date().toLocaleString("en-US", {timeZone: "Asia/Shanghai", year:"numeric"})
    const month = new Date().toLocaleString("en-US", {timeZone: "Asia/Shanghai", month:"2-digit"})
    const day = new Date().toLocaleString("en-US", {timeZone: "Asia/Shanghai", day:"2-digit"})

    if (format === "HH:MM") {
      return year + "-" + month + "-" + day + " " + hour + ":" + minute;
    }
    if (format === "HH:MM:SS") {
      return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    }
  }

  static async fetchFromRaycloud(path, hash, body={}) {
    const requestConfig = {
      method: "POST", // all raycloud's endpoint is of method POST
      headers: {
        "Content-Type": "application/json",
        app_key: process.env.RAYCLOUD_APP_KEY,
        time: RaycloudService.getCurrentTime("HH:MM"),
        sign: hash,
      }
    }

    try {
      let domainName;

      if (process.env.NODE_ENV === "DEVELOPMENT") {
        const port = process.env.RAYCLOUD_PORT;
        const ipAddress = process.env.RAYCLOUD_IP;
        domainName = ipAddress + ":" + port;
      }

      if (process.env.NODE_ENV === "PRODUCTION") {
        domainName = process.env.RAYCLOUD_DOMAIN_NAME;
      }

      const response = await axios.post("http://" + domainName + path, JSON.stringify(body), requestConfig);
      console.log(RaycloudService.getCurrentTime("HH:MM") + ": Calling Raycloud API endpoint at "+ "http://" + domainName + path)
      console.log(response.status + " " + response.statusText)
      console.log("response data: ");
      console.log(response.data);
      return response;
    } catch (error) {
      throw(error);
    }
  }
}

module.exports = RaycloudService;

