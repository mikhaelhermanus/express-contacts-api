import { ResponseError } from "../error/response-error.js"

const errorMiddleWare = (err, req, res, next) =>{
    if(err instanceof ResponseError){
        res.status(err.status).json({
            errors : err.message
        }).end();
    }else{
        res.status(500).json({
            errors : err.message
        }).end();
    }
}

export {
    errorMiddleWare
}