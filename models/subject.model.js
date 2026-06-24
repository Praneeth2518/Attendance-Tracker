import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name required'],
        trim: true
    },
    faculty: {
        type: String,
    },
    dept: {
        type: String,
        enum: ['CSE', 'ECE', 'MECH', 'CIVIL', 'CHEM', 'BIOTECH', 'PE', 'Others']
    },
    totalClasses: {
        type: Number,
        required: true,
        min: [0, 'Minimum: 0']
    },
    attendedClasses: {
        type: Number,
        required: true,
        min: [0, 'Minimum: 0'],
        validate: {
            validator(value) {
                return value <= this.totalClasses;
            },
            message: 'The attended classes must be lesser than or equal to total classes'
        }
    },
    credits: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'userId is required'],
    }

}, {
    timestamps: true
})

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;