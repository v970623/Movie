"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const applicationSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["new", "pending", "accepted", "rejected"],
        default: "new",
        required: true, // 添加 required
    },
    content: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, // 添加时间戳
});
// 添加中间件来验证状态更新
applicationSchema.pre("save", function (next) {
    next();
});
exports.default = (0, mongoose_1.model)("Application", applicationSchema);
