const fs = require('fs').promises;
const { Command } = require('commander');
const { loadavg } = require('os');
const program = new Command();

let users = [];


async function loadData() {
  try {
    const data = await fs.readFile('./user.json', 'utf-8');
    users = JSON.parse(data);
  } catch (err) {
    users = [];
  }
}

async function saveData() {
  await fs.writeFile('./user.json', JSON.stringify(users, null, 2));
}


function getUsers() {
  return users;
}

async function createUser(name, id) {
    try{
    await loadData()
    users.push({name,id})
   await saveData()
     console.log('User created:', { name, id });
    }
    catch(err){
        console.error('Error creating user:', err);
    }  
}
async function deleteUser(id) {
  try{
    await loadData()
    users= users.filter((user)=> user.id !== id)
    await saveData()
    console.log('User deleted:', users);
    
  }
  catch(err){
    console.error('Error deleting user:', err);
  }
}

async function updateUser(id, name) {
  try{
    await loadData()
    users = users.map((user)=> user.id === id ? {...user, name: name} : user)
    await saveData()
    console.log('User updated:', users);

  }
  catch(err){
    console.error('Error updating user:', err);
  }
}

program
  .command('getUsers')
  .description('Get all users in file')
  .action(async () => {
    await loadData(); 
    console.log(getUsers());
  });

program
  .command('createUser')
  .description('create a new user')
  .requiredOption('-n, --name <name>', 'your name')
  .requiredOption('--id <id>','your id')
  .action(async (options) => {
    await createUser(options.name,options.id)
  }); 

  program
  .command('deleteUser')
  .description('delete user with id')
  .requiredOption('--id <id>','your id')
  .action(async (options) => {
    await deleteUser(options.id)
  }); 


  program
  .command('updateUser')
  .description('update user')
  .requiredOption('--name <name>','your name')
  .requiredOption('--id <id>','your id')
  .action(async (options) => {
    await updateUser(options.id,options.name)
  }); 




program.parse(process.argv);
