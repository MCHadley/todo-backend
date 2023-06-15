/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
'use strict';
const dynamo = require('../utils/dynamo');
const {responseHandler} = require('../utils/Utils');
const todoTable = process.env.DYNAMODB_TABLE;
const {v4: uuidv4} = require('uuid');


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
      entityType: 'todo',
      gsi1pk: `${todo.userId}#todo`,
    },
  };
  let response;
  try {
    const result = await dynamo.putItem(input);
    response = responseHandler(200, 'Todo was created');
  } catch (error) {
    response = responseHandler(400, 'An error has occured, todo not added');
  }
  return response;
};

const queryTodos = async (event, context) => {
  const gsi1pk = `${event.queryStringParameters.userId}#todo`;
  const params = {
    TableName: todoTable,
    IndexName: 'gsi1pk',
    KeyConditionExpression: 'gsi1pk = :gsi1pk',
    ExpressionAttributeValues: {
      ':gsi1pk': gsi1pk,
    },
  };
  let response;
  try {
    const result = await dynamo.queryTable(params);
    response = responseHandler(200, result.Items);
  } catch (error) {
    response = responseHandler(400, 'An error has occured, todos not retreived');
  }
  return response;
};

const deleteTodo = async (event, context) => {
  const item = JSON.parse(event.body);
  const commandInput = {
    TableName: todoTable,
    Key: {id: item.id, userId: item.userId},
  };
  let response;
  try {
    const result = await dynamo.deleteItem(commandInput);
    response = responseHandler(200, 'Item deleted');
  } catch (error) {
    response = responseHandler(400, 'An error has occured deleting this item');
  }
  return response;
};

const updateTodo = async (event, context) => {
  const item = JSON.parse(event.body);
  const params = {
    TableName: todoTable,
    Key: {id: item.id, userId: item.userId},
    UpdateExpression: 'SET #status = :s, #description = :d, #title = :t',
    ExpressionAttributeNames: {
      '#status': 'status',
      '#description': 'description',
      '#title': 'title',

    },
    ExpressionAttributeValues: {
      ':s': item.status,
      ':d': item.description,
      ':t': item.title,
    },
  };
  let response;
  try {
    const result = await dynamo.updateItem(params);
    response = responseHandler(200, 'Item was updated');
  } catch (error) {
    response = responseHandler(400, 'An error has occured updating this item');
  }
  return response;
};

module.exports = {
  createTodo,
  queryTodos,
  deleteTodo,
  updateTodo,
};
