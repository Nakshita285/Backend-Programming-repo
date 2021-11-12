module.exports.createElement = function (elementName, elementModel){
    return async function(request, response){
        try{
            let element = request.body;
            if(element){
                element = await elementModel.create(element);
                response.status(200).json({
                    message: `${elementName} created successfully`
                })
            }else{
                console.log(error);
                response.status(204).json({
                    message:"Not Created"
                })
            }
        }catch(error){
            console.log(error);
            response.status(500).json({
                message: "Error occured",
                error: error.message
            })
        }
    }
}

module.exports.getElements = function(elementName, elementModel){
    return async function(request,response){
        try{
            let elements = await elementModel.find();
            response.status(200).json({
                message: `All the ${elementName}s are as follows:-`,
            elements : elements
            })
        }catch(error){
            console.log(error);
            response.status(500).json({
                message: `Error occured / NO ${elementName} found` ,
                error: error.message
            })
        }
        
    }
}



module.exports.getElementById = function (elementName, elementModel){
    return async function(request, response){
        try{
            let id = request.body.id;
            // console.log(name);
            let element = await elementModel.findOne({_id: id});
            response.status(200).json({
                message: `${elementName} found successfully`,
                element: element
            })
        }catch(error){
            response.status(500).json({
                messag: `${elementName} Not found`,
                error: error.message
            })
        }
    }
}

module.exports.updateElement = function(elementName, elementModel){
    return async function (request, response){
        let { id } = request.body;
        try{
            let element = await elementModel.findById(id);
            if(element){
                delete request.body.id;
                for(let key in request.body){
                    element[key] = request.body[key];
                }
                element.save();
                response.status(200).json({
                    message: `${elementName} Updated successfully`,
                    element: updatedPlan
                }) 

            }else {
                resposne.status(404).json({
                    message: `${elementName} Not found`
                })
            }
            
        }catch(error){
            response.status(500).json({
                message: "Server error",
                error: error.message
            })
        }
    }
}


module.exports.deleteElement = function(elementName, elementModel){
    return async function(request, response){
        try{
            let {id} = request.body;
            let element = await elementModel.findById(id);
            if(element){
                let deletedElement = await elementModel.findByIdAndDelete(id);
                response.status(204).json({
                    message: `${elementName} Deleted Succesfully`,
                    Element: deletedElement
                })
            }else {
                response.status(404).json({
                    message: `${elementName} Not found`
                })
            }
        }catch(error){
            response.status(500).json({
            message: "Server error",
            error: error.message
            })
        }
    }
}
