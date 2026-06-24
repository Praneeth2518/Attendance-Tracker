import { Router } from "express";
import {
    createSubject,
    deleteSubject,
    getAllSubjects,
    getSubject,
    updateSubject
} from "../controllers/subject.controller.js";

const subjectRouter = Router();

subjectRouter.get('/', getAllSubjects);

subjectRouter.get('/:id', getSubject);

subjectRouter.post('/', createSubject);

subjectRouter.put('/:id', updateSubject);

subjectRouter.delete('/:id', deleteSubject);

export default subjectRouter;