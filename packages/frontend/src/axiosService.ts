import axios, { AxiosInstance } from "axios";

class Axios {
  instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({});
  }

  refreshRequestHandler(token: string) {
    this.instance = axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }
}

export default new Axios();
