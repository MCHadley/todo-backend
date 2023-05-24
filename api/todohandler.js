'use strict';
const dynamo = require("../config/dynamoPut");
const ObjectId = require("node-time-uuid");

const createTodo = async (event, context) => {
    const requestBody = JSON.parse(event.body);
    const todo = requestBody;

    var uuid = new ObjectId();
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            userId: { S: todo.userId },
            id: { S: uuid.toString() },
            title: { S: todo.title },
            description: { S: todo.description },
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