const http = require('http');
const fs = require('fs').promises;

const filePath = './users.json';

async function loadUsers() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function saveUsers(users) {
  await fs.writeFile(filePath, JSON.stringify(users, null, 2));
}

const server = http.createServer(async (req, res) => {

  const url = req.url;
  const method = req.method;

  if (url === '/users' && method === 'GET') {
    const users = await loadUsers();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  }

  else if (url.startsWith('/users/') && method === 'GET') {
    const id = parseInt(url.split('/')[2]);
    const users = await loadUsers();
    const user = users.find(u => u.id === id);

    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('User not found');
    }
  }

 
  else if (url === '/users' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      const newUser = JSON.parse(body);
      const users = await loadUsers();
      users.push(newUser);
      await saveUsers(users);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    });
  }

  else if (url.startsWith('/users/') && method === 'PUT') {
    const id = parseInt(url.split('/')[2]);
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      const updatedUser = JSON.parse(body);
      let users = await loadUsers();
      const index = users.findIndex(u => u.id === id);

      if (index !== -1) {
        users[index] = { ...users[index], ...updatedUser };
        await saveUsers(users);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users[index]));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('User not found');
      }
    });
  }

  
  else if (url.startsWith('/users/') && method === 'DELETE') {
    const id = parseInt(url.split('/')[2]);
    let users = await loadUsers();
    const newUsers = users.filter(u => u.id !== id);

    if (users.length !== newUsers.length) {
      await saveUsers(newUsers);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('User deleted');
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('User not found');
    }
  }


  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
