'use strict';
const dynamo = require("../config/dynamo");


const createTodo = async (event, context) => {
    const requestBody = JSON.parse(event.body);
    const todo = requestBody;
    const result = await dynamo.putItem(todo);
    if (result.success == true) {
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

const queryTodos = async (event, context) => {
    const tableName = process.env.DYNAMODB_TABLE;
    const queryInput = `${event.queryStringParameters.userId}#todo`
    const result = await dynamo.queryTable(tableName, queryInput);
    return {
        statusCode: 200,
        body: JSON.stringify(result)
    }
}

const deleteTodo = async (event, context) => {
    const tableName = process.env.DYNAMODB_TABLE;
    const item = JSON.parse(event.body)
    const result = await dynamo.deleteItem(tableName, item.id, item.userId)
    return {
        statusCode: 200,
        body: JSON.stringify(result)
    }
}

module.exports = {
    createTodo,
    queryTodos,
    deleteTodo
}