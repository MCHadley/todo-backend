const { DynamoDBClient, PutItemCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");

const putItem = async (item) => {
    // Create an instance of the DynamoDB client
    const client = new DynamoDBClient({ region: "us-east-1" }); // Replace with your desired region

    // Create a PutItem command with the prepared parameters
    const command = new PutItemCommand(item);

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

const scanTable = async (tableName) => {
    // Create a DynamoDB client
    const client = new DynamoDBClient({ region: 'us-east-1' }); // Replace with your desired region

    // Create a ScanCommand
    const scanCommand = new ScanCommand({ TableName: tableName });

    try {
        // Execute the Scan command
        const response = await client.send(scanCommand);
        const items = response.Items;
        return items;
    } catch (error) {
        console.error('Error scanning table:', error);
    }
};

module.exports = {
    putItem,
    scanTable
};