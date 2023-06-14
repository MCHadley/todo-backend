const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand, PutCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const putItem = async (tableName, item) => {
    const client = new DynamoDBClient({ region: 'us-east-1' });
    const ddbDocClient = DynamoDBDocumentClient.from(client)

    const currentDate = new Date();

    const input = {
        TableName: tableName,
        Item: {
            id: uuidv4(),
            userId: item.userId,
            title: item.title,
            description: item.description,
            createdAt: currentDate.toISOString(),
            status: item.status,
            entityType: "todo",
            gsi1pk: `${item.userId}#todo`
        }
    }
    const command = new PutCommand(input)

    try {
        const response = await ddbDocClient.send(command)
        return { success: true, message: response }
    } catch (error) {
        console.error(`Error putting item ${error}`);
    }
    ddbDocClient.destroy();
    client.destroy();
};

const queryTable = async (tableName, gsi1pk) => {
    const client = new DynamoDBClient({ region: 'us-east-1' });
    const ddbDocClient = DynamoDBDocumentClient.from(client)

    const params = {
        TableName: tableName,
        IndexName: 'gsi1pk',
        KeyConditionExpression: 'gsi1pk = :gsi1pk',
        ExpressionAttributeValues: {
            ':gsi1pk': gsi1pk
        }
    }

    const queryCommand = new QueryCommand(params)

    try {
        const response = await ddbDocClient.send(queryCommand)
        const items = response.Items;
        return items;
    } catch (error) {
        console.error('Error querying table:', error);
    }
    ddbDocClient.destroy();
    client.destroy();
}

const deleteItem = async (tableName, todoId, userId) => {
    const client = new DynamoDBClient({ region: 'us-east-1' });
    const ddbDocClient = DynamoDBDocumentClient.from(client)

    const commandInput = {
        TableName: tableName,
        Key: { id: todoId, userId: userId }
    }
    const deleteCommmand = new DeleteCommand(commandInput)

    try {
        const response = await ddbDocClient.send(deleteCommmand)
        return response
    } catch (error) {
        console.error(`Error deleting item: ${error}`)
    }
    ddbDocClient.destroy();
    client.destroy();
}

const updateItem = async (tableName, todoItem) => {
    const client = new DynamoDBClient({ region: 'us-east-1' });
    const ddbDocClient = DynamoDBDocumentClient.from(client)

    const params = {
        TableName: tableName,
        Key: { id: todoItem.id, userId: todoItem.userId },
        UpdateExpression: 'SET #status = :s, #description = :d, #title = :t',
        ExpressionAttributeNames: {
            "#status": "status",
            "#description": "description",
            "#title": "title"

        },
        ExpressionAttributeValues: {
            ":s": todoItem.status,
            ":d": todoItem.description,
            ":t": todoItem.title
        }

    }
    const updateCommand = new UpdateCommand(params)

    try {
        const response = await ddbDocClient.send(updateCommand)
        return response
    } catch (error) {
        console.error(`Error updating item: ${error}`)
    }
    ddbDocClient.destroy();
    client.destroy();
}

module.exports = {
    putItem,
    queryTable,
    deleteItem,
    updateItem
};