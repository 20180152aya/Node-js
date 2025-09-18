import fs from 'fs/promises';
import { parse } from 'path';
const [,, action,info] = process.argv;

let data = await fs.readFile('./user.json','utf-8')
let proceesedDate = JSON.parse(data);
function getAllUsers(){
    return proceesedDate;
}

function getUser(id){
  let user= proceesedDate.find((user)=> user.id === parseInt(id))
  return user || 'Dont have user whith this id'
}

async function addUser(user){
    const newuser = JSON.parse(user)
    if(Array.isArray(proceesedDate)){
        proceesedDate.push(newuser)
    }
    else {proceesedDate = [proceesedDate,newuser]}

    await fs.writeFile("./user.json", JSON.stringify(proceesedDate));
    return proceesedDate
}

async function deleteUser (info) {
    const lengthBefore = proceesedDate.length
    proceesedDate = proceesedDate.filter((user)=> user.id !== parseInt(info))
    if(proceesedDate.length === lengthBefore) return "Dont have user whith this id"
    else {
        await fs.writeFile("./user.json", JSON.stringify(proceesedDate));
    }
    return "user deleted"
 }

let result;

switch(action){
    case "getAllUsers":
        result = getAllUsers()
        break
    case "getUser":
        result = getUser(info)
        break
    case "addUser":
        result = await addUser(info)
        break
    case "deleteUser":
        result = await deleteUser(info)
        break    
    default:
        console.log("Invalid action")
        break;
}
console.log(`The result is: ${JSON.stringify(result, null, 2)}`);
