const AWS = require('aws-sdk');
AWS.config.update({ region: 'ca-central-1' });

const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.TABLE_NAME;

exports.handler = async(event) => {
    let userid = event.pathParameters.userid;
    let {firstName, lastName, email, website} = JSON.parse(event.body);

    let item = {
        userid: userid,
        firstName: firstName,
        lastName: lastName,
        email: email,
        website: website
    }

   await dynamodb.put({
        TableName: tableName,
        Item: item
    }).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Data inserted/updated successfully."
        })
    };
}