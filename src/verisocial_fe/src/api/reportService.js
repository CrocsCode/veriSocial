import { requests } from "./axiosInstance";

const reportService = {
    postReport: (report) => requests.post("/admin/report", report),
};

export default reportService;