'use strict';
const dynamo = require("../config/dynamo");
const { v4: uuidv4 } = require("uuid");
const currentDate = new Date();

const createTodo = async (event, context) => {
    const requestBody = JSON.parse(event.body);
    const todo = requestBody;
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            id: { S: uuidv4() },
            userId: { S: todo.userId },
            title: { S: todo.title },
            description: { S: todo.description },
            createdAt: { S: currentDate.toISOString() },
            status: { S: todo.status },
            entityType: { S: 'todo' },
            gsi1pk: { S: `${todo.userId}#todo` }
        }
    }
    const result = await dynamo.putItem(params);
    return result;
}

const scanTodos = async (event, context) => {
    const tableName = process.env.DYNAMODB_TABLE;
    const result = await dynamo.scanTable(tableName);
    return {
        statusCode: 200,
        body: JSON.stringify(result)
    };
}

const queryTodos = async (event, context) => {
    const tableName = process.env.DYNAMODB_TABLE;
    const result = await dynamo.queryTable(tableName, `${event.queryStringParameters.userId}#todo`);
    return {
        statusCode: 200,
        body: JSON.stringify(result)
    }
}

module.exports = {
    createTodo,
    scanTodos,
    queryTodos
}