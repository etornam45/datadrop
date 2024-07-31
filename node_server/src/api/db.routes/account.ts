import express from 'express'
import { authenticate, prisma } from '../utils'
import { 
    JwtPayload,
    sign, 
    verify
} from 'jsonwebtoken'
const userRouter = express.Router()

userRouter.get('/', async (req, res) => {
    try {
        const users = await prisma.user.findMany()
        res.json(users)
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' })
    }
})

userRouter.get('/profile', authenticate, async (req, res) => {
    console.log(req.headers.JWTuserId)
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.headers.JWTuserId as string
            }
        })
        res.json(user)
    } catch (error) {
        res.status(401).json({ error: 'Internal server error' })
    }
})

userRouter.get('/profile/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        })
        res.json(user)
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' })
    }
})


userRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            }
        })

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password' })
        }

        const token = sign({ id : user.id }, 'secret', {
            expiresIn: '48h'
        })

        // SET-COOKIE
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })

        res.json(user)
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' })
    }
})

userRouter.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body
        const user = await prisma.user.create({
            data: {
                email: email,
                password: password,
                name: name
            }
        })
        res.json(user)
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' })
    }
})

export default userRouter