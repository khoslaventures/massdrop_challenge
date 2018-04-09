import {Schema, model} from 'mongoose';

let JobSchema: Schema = new Schema({
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

export default model('Job', JobSchema);
