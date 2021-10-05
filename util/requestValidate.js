module.exports={
    validate(requestBody,params,res){
        var error=[];
        params.forEach(param => {
            if(!requestBody[param] &&(requestBody[param] =="" || requestBody[param]==null || requestBody[param] ===undefined)){
                error.push(`${param} is required field`);
            }
        });
        if(error.length>0){
            res.status(400).send(error);
        }
        else
        {
            return true;
        }
    }
}