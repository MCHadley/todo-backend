'use strict';
const dynamo = require("../config/dynamo");


const createTodo = async (event, context) => {
    const requestBody = JSON.parse(event.body);
    const todo = requestBody;
    const result = await dynamo.putItem(todo);
    if (result.success === "true") {
        return {
            statusCode: 200,
            body: JSON.stringify(result.message)
        }
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify(result.message)
        }
    }
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