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
            todoId: { S: uuidv4() },
            userId: { S: todo.userId },
            title: { S: todo.title },
            description: { S: todo.description },
            createdAt: { S: currentDate.toISOString() },
            status: { S: todo.status }
        }
    }
    const result = await dynamo.putItem(params);
    return result;
}

const getTodos = async (event, context) => {
    const tableName = process.env.DYNAMODB_TABLE;
    const result = await dynamo.scanTable(tableName);
    console.log(result);
    return {
        statusCode: 200,
        body: JSON.stringify(result)
    };
}

module.exports = {
    createTodo,
    getTodos
}