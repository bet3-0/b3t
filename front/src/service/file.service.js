/* This is an example file */
import authHeader from "./auth-header";
import { API_URL } from "./config";

export default class FileService {
  static async getUrl(Idfile) {
    console.log("fetching url...");
    try {
      let response = await fetch(API_URL+"file/url/"+Idfile, {
        method: "GET",
        headers: Object.assign(authHeader()),
      });
      console.log("url :"+response.ok);
      let jsonResponse = await response.json();
      console.log(JSON.stringify(jsonResponse));

      return jsonResponse.url;

    } catch (error) {
      console.log("Error while downloading file!");
      console.error(error);
      return undefined;
    }
  }

  static async pushFile(data) {
    console.log("Pushing file...");
    let response;
    try {
      const formData = new FormData();

      formData.append('file', data);

      const options = {
        method: 'POST',
        body: formData,
        headers: Object.assign(authHeader()),
      };

      response = await fetch(API_URL + "file", options);
    } catch (error) {
      console.log("Error while sending file: fetch error!");
      console.error(error);
      return undefined;
    }
    if (!response.ok) {
      console.log("Error while sending file: response error!");
      console.warn(response);
      return undefined;
    }

    let jsonResponse;
    try {
      jsonResponse = await response.json();
    } catch (error) {
      console.log("Error while sending file: response data error!");
      console.warn(response);
      return undefined;
    }
    console.log("File sent successfully!");
    return jsonResponse.id;
  }
}