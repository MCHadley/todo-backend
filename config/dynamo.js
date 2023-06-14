const { DynamoDBClient, PutItemCommand, DeleteItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { QueryCommand, } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");
const currentDate = new Date();

const putItem = async (item) => {
    // Create an instance of the DynamoDB client
    const client = new DynamoDBClient({ region: "us-east-1" });
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            id: { S: uuidv4() },
            userId: { S: item.userId },
            title: { S: item.title },
            description: { S: item.description },
            createdAt: { S: currentDate.toISOString() },
            status: { S: item.status },
            entityType: { S: 'todo' },
            gsi1pk: { S: `${item.userId}#todo` }
        }
    }
    // Create a PutItem command with the prepared parameters
    const command = new PutItemCommand(params);

    try {
        // Execute the PutItem command
        await client.send(command);
        console.log("Item put successfully");
        return { success: true, message: "Item put successfully" };
    } catch (error) {
        console.log("Error putting item:");
        return { success: false, message: "Error putting item" };
    }
};

const queryTable = async (tableName, gsi1pk) => {
    const client = new DynamoDBClient({ region: 'us-east-1' });

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
        const response = await client.send(queryCommand)
        const items = response.Items;
        return items;
    } catch (error) {
        console.error('Error querying table:', error);
    }
}

const deleteItem = async (tableName, todoId, userId) => {
    const client = new DynamoDBClient({ region: 'us-east-1' });

    const params = {
        TableName: tableName,
        Key: {
            id: {
                "S": todoId
            },
            userId: {
                "S": userId
            }
        }
    }

    const deleteCommand = new DeleteItemCommand(params)

    try {
        console.log(params);
        const response = await client.send(deleteCommand)
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