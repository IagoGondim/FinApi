const express = require("express");
const app = express();
const {v4: uuidv4} = require("uuid")
const customers = [];
app.use(express.json());


app.post("/account", (request, response) => {
    const {cpf, name}  = request.body;
    const customerAlreadyExists = customers.some(
        (customer) => customer.cpf === cpf
    );

if (customerAlreadyExists){
    return response.status(400).json({error: "Customer already exists!"});
}
    const id = uuidv4();
    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement:[]
    });
    return response.status(201).send();

});



app.listen(3333);