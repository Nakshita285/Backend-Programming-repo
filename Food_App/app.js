const express = require("express");
const app=express();

// to use the body from the postman
app.use(express.json());
// allows the file to seen in public on the UI
app.use(express.static('public'));

let user=[{
    email:"abc@gmail.com",
    username:"Nakshita",
    password: "123"
}]

const userRouter = express.Router();
const authRouter = express.Router();


app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

authRouter.route('/signUp')
    .post(signUpUser)

authRouter.route('/signIn')
    .post(signInUser)

function signUpUser(request, response){
    // email, Name, Password
    let {email, name, password } = request.body;
    user.push({email, name, password});
    console.log(request.body);
    response.status(200).json({
        message: 'User Created',
        createdUser: request.body
    })
}

// here we are going to add the login page 
function signInUser(request, response){
    // email
    // password
    // console.log(request.body);
    let email = request.body.email;
    let password = request.body.password;
    let flag = false;
    // check the user is valid or not
    if(email && password){
        for(let key =0; key<user.length; key++){
            if(email == user[key].email && password == user[key].password){
                response.status(200).send("Login Successfully");
                console.log("Matched!!!");
                flag =true;
                break;
            }
        }
    }
    if(!flag){
        console.log("Not matched!!");
        response.status(400).json({
            message: "Incorrect Email or Password"
        })
    }    
}
        
userRouter.route('/')
    .get(getUser)
    .post(createUser)
    .patch(updateUser)
    .delete(deleteUser)

userRouter.route('/:id')
    .get(createUserById)

function createUser(request, reponse){
    user=request.body;
    console.log("Data is requested!");
    response.status(200).send(user);
}
function getUser(request, response){ 
    response.JSON(user);
    console.log("User info is fetched!");
}

function updateUser(request, reponse){
    let obj = request.body;

}
function deleteUser(request, response){
}
function createUserById(request, response){

}

app.listen(8080, function(){
    console.log("the server started");
})

