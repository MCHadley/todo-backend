const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand, PutCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDBClient({ region: 'us-east-1' });
const ddbDocClient = DynamoDBDocumentClient.from(client)

const putItem = async (input) => {
    const putCommand = new PutCommand(input)
    try {
        const response = await ddbDocClient.send(putCommand)
        return { success: true, message: response }
    } catch (error) {
        console.error(`Error putting item ${error}`);
    }
};

const queryTable = async (input) => {
    const queryCommand = new QueryCommand(input)

    try {
        const response = await ddbDocClient.send(queryCommand)
        const items = response.Items;
        return items;
    } catch (error) {
        console.error('Error querying table:', error);
    }
}

const deleteItem = async (input) => {
    const deleteCommmand = new DeleteCommand(input)

    try {
        const response = await ddbDocClient.send(deleteCommmand)
        return { success: true, message: response }
    } catch (error) {
        console.error(`Error deleting item: ${error}`)
    }
}

const updateItem = async (input) => {
    const updateCommand = new UpdateCommand(input)

    try {
        const response = await ddbDocClient.send(updateCommand)
        return { success: true, message: response }
    } catch (error) {
        console.error(`Error updating item: ${error}`)
    }
}

module.exports = {
    putItem,
    queryTable,
    deleteItem,
    updateItem
};