const { DynamoDBClient, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand, PutCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDBClient({ region: 'us-east-1' });
const ddbDocClient = DynamoDBDocumentClient.from(client)
const { v4: uuidv4 } = require("uuid");

const putItem = async (tableName, item) => {
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
        return { success: false, message: "Error putting item" };
    }
};

const queryTable = async (tableName, gsi1pk) => {
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
}

const deleteItem = async (tableName, todoId, userId) => {

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
}

const updateItem = async (tableName, todoItem) => {
    const client = new DynamoDBClient({ region: 'us-east-1' });
    const params = {
        TableName: tableName,
        Key: {
            id: { "S": todoItem.id },
            userId: { "S": todoItem.userId }
        },
        UpdateExpression: 'SET #status = :status, #description = :description, #title = :title',
        ExpressionAttributeNames: {
            '#status': 'status',
            '#description': 'description',
            '#title': 'title'
        },
        ExpressionAttributeValues: {
            ':status': { "S": todoItem.status },
            ':description': { "S": todoItem.description },
            ':title': { "S": todoItem.title }
        }
    };
    const updateCommand = new UpdateItemCommand(params)

    try {
        const response = await client.send(updateCommand)
        return response
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