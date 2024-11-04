"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const applicationController_1 = require("../controllers/applicationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/submit", authMiddleware_1.authenticate, (req, res) => {
    (0, applicationController_1.submitApplication)(req, res);
});
router.put("/update", authMiddleware_1.authenticate, (req, res) => {
    (0, applicationController_1.updateApplicationStatus)(req, res);
});
exports.default = router;
