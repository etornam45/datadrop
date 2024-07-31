import { PrismaClient } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

export const prisma = new PrismaClient()

import { JwtPayload } from 'jsonwebtoken';

export const authenticate = async (req: Request & { userId?: string }, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token 
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' })
        }
        const payload: JwtPayload = verify(token, 'secret') as JwtPayload;
        req.headers.JWTuserId = payload.id
        next()
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' })
    }
}