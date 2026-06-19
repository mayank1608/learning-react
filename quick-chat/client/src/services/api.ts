
import axios from "axios";
import Cookies from "js-cookie";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import store from "../redux/store";

const api = axios.create({
    baseURL: "http://localhost:5000/api", // your base URL
});

let requestCount = 0;

const LOADER_APIS = ["/login", "/register"];

api.interceptors.request.use(
    (config) => {

        // dispatch showLoader action on LOADER_APIS api call

        const shouldShowLoader = LOADER_APIS.some(url =>
            config.url?.includes(url)
        );

        if (shouldShowLoader) {
            requestCount++;
            store.dispatch(showLoader());
        }

        // const token = localStorage.getItem("token");
        const token = Cookies.get("token");

        // Skip token for login & register APIs
        const excludeUrls = ["/login", "/register"];

        const isExcluded = excludeUrls.some((url) =>
            config.url?.includes(url)
        );

        if (token && !isExcluded) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {

        // dispatch hideLoader action on LOADER_APIS api call
        const shouldHideLoader = LOADER_APIS.some(url =>
            response.config.url?.includes(url)
        );

        if (shouldHideLoader) {
            requestCount--;
            if (requestCount === 0) {
                store.dispatch(hideLoader());
            }
        }

        return response.data
    },
    (error) => {
        // dispatch hideLoader action on api call
        requestCount--;
        if (requestCount === 0) {
            store.dispatch(hideLoader());
        }

        if (error.response?.status === 401) {
            console.log("Unauthorized - redirect to login");
            // localStorage.removeItem("token");
            Cookies.remove("token");
            window.location.href = "/login"; // or use navigate in app
        }

        return Promise.reject(error);
    }
);

export default api
