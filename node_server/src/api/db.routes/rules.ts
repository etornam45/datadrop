import { Request, Response, Router } from "express";
import { authenticate, prisma } from "../utils";

const ruleRouter = Router();


ruleRouter.get("/", authenticate, async (req: Request, res: Response) => {
    const userId = req.headers.JWTuserId as string
    try {
        const rule = await prisma.rules.findMany({
            where: {
                userId
            }
        })

        res.status(200).json(rule)
    } catch (error) {
        res.status(500).json(error)
    }
})


ruleRouter.post("/create", authenticate, async (req: Request, res: Response) => {
    const userId = req.headers.JWTuserId as string
    const { name, value } = req.body
    console.log(name, value)
    try {
        const rule = await prisma.rules.create({
            data: {
                name: name,
                userId: userId,
                value: value
            }
        })

        res.status(200).json(rule)
    } catch (error) {
        res.status(500).json(error)
    }
})


ruleRouter.delete("/delete/:id", authenticate, async (req: Request, res: Response) => {
    const userId = req.headers.JWTuserId as string
    const { id } = req.params

    try {
        await prisma.rules.delete({
            where: {
                id, userId
            }
        })
    } catch (error) {
        res.status(500).json(error)
    }
})

export default ruleRouter