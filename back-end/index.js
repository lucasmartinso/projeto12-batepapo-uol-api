import express from "express";   
import chalk from "chalk"; 
import cors from 'cors'; 
import { MongoClient } from "mongodb"; 
import 'dayjs/locale/pt-br.js'; 
import dayjs from 'dayjs';

const app = express(); 
app.use(cors()); 
app.use(express.json());   

const mongoClient = new MongoClient("mongodb://localhost:27017"); 
let db; 

mongoClient.connect().then(() => { 
    db = mongoClient.db("Banco de dados API Bate Papo UOL"); 
    console.log(db);
}); 

const username = [];  
const mensage = []; 

app.post("/participants", (request, response) => { 
    const usersName = { 
        name: request.body.name, 
        lastStatus: Date.now() 
    }
    console.log(usersName);
    const findRepeated = username.find(user => user.name === request.body.name);  
 
    let now = dayjs().locale('pt-br');
    let hoje = now.format("HH:mm:ss"); 

    const mensageUser = { 
        from: usersName.name, 
        to: "Todos", 
        text: "Entra na sala...", 
        type: "status", 
        time: hoje
    } 
    mensage.push(mensageUser); 

    if(!usersName.name) { 
        response.sendStatus(422);  
        return;
    } else if(findRepeated) { 
        response.sendStatus(409); 
        return;
    } else {
        username.push(usersName); 
        response.sendStatus(201);
    }
}); 

app.get("/participants", (request,response) => { 
    const allParticipants = username; 
    console.log(allParticipants); 
    response.status(200).send(allParticipants);
}); 

app.post("/messages", (request,response) => {  
    
});

app.listen(5000, () => { 
    console.log(chalk.blue.bold("\nFuncionando na 5000"));
})