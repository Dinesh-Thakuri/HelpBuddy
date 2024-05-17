import axios from "axios";

BASE_URL = "http://192.168.91.93:3000/";
// BASE_URL = "http://192.168.1.82:3000/";
// BASE_URL = "http://172.16.16.277:3000/";
// BASE_URL = "http://192.168.71.176:3000/";

export default axios.create({ baseURL: `${BASE_URL}api` });

export const SOCKET_URL = `${BASE_URL}`;
