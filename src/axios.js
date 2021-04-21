import axios from "axios";

let instance;
if (process.env.NODE_ENV === "development") {
  instance = new axios.create({
    baseURL: "http://localhost:5000/",
  });

  // instance = new axios.create({
  //   baseURL: "https://api.shoplocoloco.com/",
  // });
} else {

  instance = new axios.create({
    baseURL: "https://api.shoplocoloco.com/",
  });
}

export default instance;

