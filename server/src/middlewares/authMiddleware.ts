import JWT from 'jsonwebtoken'
import { UnauthenticatedError, UnauthorizedError } from '../errors/index'
import { NextFunction, Request, Response } from 'express'

interface JwtPayload {
    userId: string
    role?: string
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}

const authenticateUser = (role?: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthenticatedError('Authentication Invalid')
        }

        const token = authHeader.split(' ')[1]

        try {
            const payload = JWT.verify(token, process.env.JWT_SECRET as string) as JwtPayload
            req.user = payload

        } catch (error) {
            throw new UnauthenticatedError('Authentication Invalid')
        }

        if (role && req.user?.role !== role) {
            throw new UnauthorizedError('Unauthorized role')
        }
        next()
    }
}


export { authenticateUser }