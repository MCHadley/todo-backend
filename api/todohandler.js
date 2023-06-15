'use strict';
const dynamo = require("../config/dynamo");
const todoTable = process.env.DYNAMODB_TABLE
const { v4: uuidv4 } = require("uuid");


const createTodo = async (event, context) => {
    const requestBody = JSON.parse(event.body);
    const todo = requestBody;
    const currentDate = new Date();
    const input = {
        TableName: todoTable,
        Item: {
            id: uuidv4(),
            userId: todo.userId,
            title: todo.title,
            description: todo.description,
            createdAt: currentDate.toISOString(),
            status: todo.status,
            entityType: "todo",
            gsi1pk: `${todo.userId}#todo`
        }
    }
    const result = await dynamo.putItem(input);
    if (result.success == true) {
        return {
            statusCode: 201,
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
    const gsi1pk = `${event.queryStringParameters.userId}#todo`
    const params = {
        TableName: todoTable,
        IndexName: 'gsi1pk',
        KeyConditionExpression: 'gsi1pk = :gsi1pk',
        ExpressionAttributeValues: {
            ':gsi1pk': gsi1pk
        }
    }
    const result = await dynamo.queryTable(params);
    return {
        statusCode: 200,
        body: JSON.stringify(result)
    }
}

const deleteTodo = async (event, context) => {
    const item = JSON.parse(event.body)
    const commandInput = {
        TableName: todoTable,
        Key: { id: item.id, userId: item.userId }
    }
    const result = await dynamo.deleteItem(commandInput)
    if (result.success == true) {
        return {
            statusCode: 200,
            body: JSON.stringify(result)
        }
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify('There was an error deleting your item')
        }
    }
}

const updateTodo = async (event, context) => {
    const item = JSON.parse(event.body)
    const params = {
        TableName: todoTable,
        Key: { id: item.id, userId: item.userId },
        UpdateExpression: 'SET #status = :s, #description = :d, #title = :t',
        ExpressionAttributeNames: {
            "#status": "status",
            "#description": "description",
            "#title": "title"

        },
        ExpressionAttributeValues: {
            ":s": item.status,
            ":d": item.description,
            ":t": item.title
        }
    }
    const result = await dynamo.updateItem(params)
    if (result.success == true) {
        return {
            statusCode: 200,
            body: JSON.stringify(result)
        }
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify('There was an error updating your item')
        }
    }
}

module.exports = {
    createTodo,
    queryTodos,
    deleteTodo,
    updateTodo
}