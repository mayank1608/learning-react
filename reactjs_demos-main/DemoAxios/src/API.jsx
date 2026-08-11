import axios from "axios";

// we need to pass the baseURL as an object
const MyAPI = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

export default MyAPI;
