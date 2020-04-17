/* This is an example file */
import authHeader from "./auth-header";
import { API_URL } from "./config";

export default class FileService {
  static async getFile(url) {
    console.log("Downloading file...");
    try {
      let response = await fetch(url, {
        method: "GET",
        headers: Object.assign(authHeader()),
      });
      console.log("File download :"+response.ok);
      let buffer = await response.blob;
      console.log(jsonResponse);
      return buffer;
    } catch (error) {
      console.log("Error while downloading file!");
      console.error(error);
      return undefined;
    }
  }
}
