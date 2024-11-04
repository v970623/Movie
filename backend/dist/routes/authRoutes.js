"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post("/register", (req, res) => {
    (0, authController_1.register)(req, res);
});
router.post("/login", (req, res) => {
    (0, authController_1.login)(req, res);
});
exports.default = router;
