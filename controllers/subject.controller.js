import mongoose from "mongoose";
import Subject from "../models/subject.model.js";
import ApiError from "../classes/apiError.class.js";

export const createSubject = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, faculty, dept, totalClasses, attendedClasses, credits } = req.body;

        const [newSubject] = await Subject.create([{ name, faculty, dept, totalClasses, attendedClasses, credits, user: req.user.id }], { session });

        await session.commitTransaction();
        session.endSession();
        res.status(201).json({
            success: true,
            data: newSubject
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const getAllSubjects = async (req, res, next) => {
    try {
        const allSubjects = await Subject.find({ user: req.user.id});

        res.status(201).json({
            success: true,
            data: allSubjects,
        })
    } catch (error) {
        next(error);
    }
}

export const updateSubject = async (req, res, next) => {
    try {
        const { name, faculty, dept, totalClasses, attendedClasses, credits } = req.body;

        const subject = await Subject.findById(req.params.id);

        if(!subject) {
            throw new ApiError(404, "No subject found.");
        }

        if(!subject.user.equals(req.user.id)) {
            throw new ApiError(403, "Forbidden");
        }

        if(name !== undefined) subject.name = name;
        if(faculty !== undefined) subject.faculty = faculty;
        if(dept !== undefined) subject.dept = dept;
        if(totalClasses !== undefined) subject.totalClasses = totalClasses;
        if(attendedClasses !== undefined) subject.attendedClasses = attendedClasses;
        if(credits !== undefined) subject.credits = credits;

        await subject.save();

        const updated = await Subject.findById(subject._id);

        console.log(updated);

        res.status(201).json({
            success: true,
            data: subject
        })
    } catch(error) {
        next(error);
    }
}

export const deleteSubject = async (req, res, next) => {
    try {
        const subject = await Subject.findById(req.params.id);

        if(!subject) {
            throw new ApiError(404, "No subject found.");
        }

        if(!subject.user.equals(req.user.id)) {
            throw new ApiError(403, "Forbidden");
        }

        await Subject.findByIdAndDelete(req.params.id);

        res.status(201).json({
            success: true,
            message: "Successfully deleted"
        })
    } catch(error) {
        next(error);
    }
}

export const getSubject = async (req, res, next) => {
    try {
        const subject = await Subject.findById(req.params.id);

        if(!subject) {
            throw new ApiError(404, "No subject found.");
        }

        if(!subject.user.equals(req.user.id)) {
            throw new ApiError(403, "Forbidden");
        }

        res.status(201).json({
            success: true,
            data: subject,
        })
    } catch (error) {
        next(error);
    }
}