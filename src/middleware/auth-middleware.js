import { logger } from "../application/logging.js";
import { prismaClient } from "../application/database.js";

export const authMiddleware = async (req, res, next) => {
    const token = req.get('Authorization')
   logger.info(token.message)
    if (!token) {
        res.status(401).json({
            errors: "Unauthorized"
        }).end();
    } else {
        const user = await prismaClient.user.findFirst({
            where: {
                token: token
            }
        });

        logger.info(user)


        if (!user) {
            res.status(401).json({
                errors: "Unauthorized"
            }).end();
        } else {
            req.user = user;
            next();
        }

    }
}