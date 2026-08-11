import axios from "axios";


const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiIxOGVmOGY5NTZjYTc0YTI3N2M3MTFmNjJiYWMzNjliZTE4OTkxZmZiMTU0OTY3Y2Y5ODM4ZTU4M2E0MmVlNDc2IiwiZXhwIjoxNzYyODcyODQ1fQ.X2IB1MpTfMTuTWTF5NzRtkN6R29Ez1Ur-bpGNNaaK0Y";
// we need to pass the baseURL as an object
const MyAPI = axios.create({
  baseURL: "https://gateway.devxidp.com/5a9a5a9a-1a71-4778-bd3e-da39fe5f6d37",
  
});

MyAPI.defaults.headers.common = {'Authorization': `bearer ${token}`}
export default MyAPI;


//https://devxidp.com/projectDetails/5a9a5a9a-1a71-4778-bd3e-da39fe5f6d37