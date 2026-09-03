class apierror extends Error{
    constructor(
        statusCode,
        message="something went wrong",
        errors=[],
        statck=""
    ){
        super(message)
        this.statusCode=statusCode
        this.errors=errors
        this.success=false
        this.message=message
        if(statck){
            this.stack=statck
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}
export {apierror}