let user = [
    {
        name:"Nakshita",
        password:"asb"
    },
    {
        name:"Hello",
        password:"123"
    }
];

let name = "Hello";
let password = "123";
let flag = false;

console.log(name == user[1].name && password == user[1].password);
// console.log(user[0].name);
// console.log(user.length);
// for(let key=0;key<user.length;key++){
//     if(name == user[key].name && password == user[key].password){
//         console.log("Matched!");
//         flag = true;
//         break;       
//     }
// }
// if(flag == false){
//     console.log("Not Matched!");
// }