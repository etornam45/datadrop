import { Router } from "express";
import { prisma } from "../utils";

const documentRouter = Router();

documentRouter.get('/', (req, res) => {
    try {
        const documents = prisma.document.findMany()
        res.json(documents)
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' })
    }
})

documentRouter.get('/document:id', (req, res) => {
    try {
        const { id } = req.params
        const document = prisma.document.findUnique({
            where: {
                id: id
            }
        })
        res.json(document)
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' })
    }
})


documentRouter.post('/create', (req, res) => {
    try {
        const { 
            content,
            filepath,
            projectId    
        } = req.body
        const document = prisma.document.create({
            data: {
                content,
                filepath,
                name: filepath.split('/').pop(),
                projectId              
            }
        })
        res.json(document)
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' })
    }
})

documentRouter.put('/update:id', (req, res) => {
    try {
        const { id } = req.params
        const { 
            content,
            filepath,
            projectId    
        } = req.body
        const document = prisma.document.update({
            where: {
                id: id
            },
            data: {
                content,
                filepath,
                name: filepath.split('/').pop(),
                projectId
            }
        })
        res.json(document)
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' })
    }
})


documentRouter.delete('/delete:id', (req, res) => {
    try {
        const { id } = req.params
        const document = prisma.document.delete({
            where: {
                id: id
            }
        })
        res.json(document)
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' })
    }
})

export default documentRouter;