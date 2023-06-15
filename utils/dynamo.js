/* eslint-disable max-len */
const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {DynamoDBDocumentClient, QueryCommand, PutCommand, UpdateCommand, DeleteCommand} = require('@aws-sdk/lib-dynamodb');
const client = new DynamoDBClient({region: 'us-east-1'});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const putItem = async (input) => {
  const putCommand = new PutCommand(input);
  let response;
  try {
    response = await ddbDocClient.send(putCommand);
  } catch (error) {
    console.error(`Error putting item ${error}`);
    throw error;
  }
  return response;
};

const queryTable = async (input) => {
  const queryCommand = new QueryCommand(input);
  let response;
  try {
    response = await ddbDocClient.send(queryCommand);
  } catch (error) {
    console.error('Error querying table:', error);
    throw error;
  }
  return response;
};

const deleteItem = async (input) => {
  const deleteCommmand = new DeleteCommand(input);
  let response;
  try {
    response = await ddbDocClient.send(deleteCommmand);
  } catch (error) {
    console.error(`Error deleting item: ${error}`);
    throw error;
  }
  return response;
};

const updateItem = async (input) => {
  const updateCommand = new UpdateCommand(input);
  let response;
  try {
    response = await ddbDocClient.send(updateCommand);
  } catch (error) {
    console.error(`Error updating item: ${error}`);
    throw error;
  }
  return response;
};

module.exports = {
  putItem,
  queryTable,
  deleteItem,
  updateItem,
};
