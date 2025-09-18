// Task 1

const [,, action,...numbers] =process.argv;
function add(nums){
    return nums.reduce((acc,val)=>{
        return acc + parseInt(val)
    },0)
}
function multiple(nums){
    return nums.reduce((acc,val)=>{
        return acc * parseInt(val)
    },1
)}

function subtract(nums){
    return nums.slice(1).reduce((acc,val)=>{
        return acc - parseInt(val)
    },parseInt(nums[0]))
}
function divide(nums){
    if(nums.length > 2) return "Can only divide two numbers";
    else if( parseInt(nums[1])=== 0) return "Cannot divide by zero";
    else return parseInt(nums[0]) / parseInt(nums[1]);
}

let result;
switch(action){
    case "add":
        result =add(numbers);
        break;
    case "multiple":
        result = multiple(numbers);
        break;   
    case "subtract":
        result = subtract(numbers);
        break; 
    case "divide":
        result = divide(numbers);
        break;    
    default:
        console.log("Invalid action");
        break;

}

console.log(`THe result is: ${result}`);
