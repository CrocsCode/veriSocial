import { requests } from "./axiosInstance";

const reportService = {
    postReport: (report) => requests.post("/admin/report", report),
    getReportList: () => requests.get("/admin/report"),
};

export default reportService;