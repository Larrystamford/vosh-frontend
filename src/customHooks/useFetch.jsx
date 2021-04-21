import { useEffect, useState } from "react";
import axios from "../axios";

export const useFetch = (url, params) => {
  const [state, setState] = useState({ data: null, loading: true });
  useEffect(() => {
    axios.get("/v1/video/getByVideoId/" + params).then((response) => {
      let data = response.data[0];
      setState({ data: data, loading: false });
    });
  }, [url, setState]);

  return state;
};
