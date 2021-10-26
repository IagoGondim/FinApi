const express = require("express");
const app = express();
const {v4: uuidv4} = require("uuid")
const customers = [];
app.use(express.json());


//Middleware
function verifyIfExistsAccountCPF(request, response, next) {
    const {cpf} = request.headers;
    
    const customer = customers.find(customer => customer.cpf === cpf);
    
    if(!customer){
        return response.status(400).json({ error: "Customer not found"});
    }

    request.customer = customer;
    return next();

}

//Possivel criar conta e não é possivel cadastar um CPF já existente.
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

//app.use(verifyIfExistsAccountCPF);

//possível buscar extrato bancário do cliente, não deve ser possível buscar extrato em uma conta não existente
app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;
    return response.json(customer.statement);
});

//possivel realizar o depósito
app. post("/deposit", verifyIfExistsAccountCPF, (request, response) => {
    const {description, amount} = request.body
    const {customer} = request;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type : "credit"
    }
customer.statement.push(statementOperation);

return response.status(201).send();

})

//possivel realizar saque
app.post("/withdraw", verifyIfExistsAccountCPF, (request, response) => {
    const {amount} = request.body;
    const {customer} = request;

    const balance = getBalance(customer.statement);

    if(balance < amount) {
        return response.status(400).json({error : "Insufficient funds!"});
    }

    const statementOperarion ={
        amount,
        created_at: new Date(),
        type: "debit",
    };

    customer.statement.push(statementOperarion);
    return responde.status(201).send();





})

//consultar extratos, falta corrigir
app.get("/statement/date", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;
    const {date} = request.query;

    const dateFormat = new Date(date + " 00:00");

    const statement = customer.statement.filter(
        (statement) =>
            statement.create_at.toDateString() === 
            new Date(dateFormat).toDateString()
    );

    return response.json(statement);
});






app.listen(3333);