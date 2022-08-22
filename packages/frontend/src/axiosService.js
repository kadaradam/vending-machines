import axios from "axios";

class Axios {
  instance = null;

  constructor() {
    this.instance = axios.create();
  }

  refreshRequestHandler(token) {
    this.instance = axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }
}

export default new Axios();
