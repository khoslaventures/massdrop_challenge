"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
let JobSchema = new mongoose_1.Schema({
    createdAt: Date,
    url: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        default: 'In Progress',
    }
});
exports.default = mongoose_1.model('Job', JobSchema);
