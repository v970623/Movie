"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatus = exports.submitApplication = void 0;
const applicationModel_1 = __importDefault(require("../models/applicationModel"));
const submitApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content } = req.body;
    try {
        if (!req.user) {
            res.status(401).json({ error: "未授权" });
            return;
        }
        const application = new applicationModel_1.default({
            userId: req.user.id,
            content,
        });
        yield application.save();
        res.status(201).json({ message: "申请提交成功" });
    }
    catch (error) {
        res.status(400).json({ error: "提交失败" });
    }
});
exports.submitApplication = submitApplication;
const updateApplicationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { applicationId, status } = req.body;
    const validStatuses = ["new", "pending", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
        res.status(400).json({ error: "无效的状态值" });
        return;
    }
    try {
        const application = yield applicationModel_1.default.findById(applicationId);
        if (!application) {
            res.status(404).json({ error: "未找到申请" });
            return;
        }
        application.status = status;
        const savedApplication = yield application.save();
        res.json({
            message: "状态更新成功",
            application: {
                id: savedApplication._id,
                status: savedApplication.status,
            },
        });
    }
    catch (error) {
        res.status(400).json({ error: "更新失败" });
    }
});
exports.updateApplicationStatus = updateApplicationStatus;
