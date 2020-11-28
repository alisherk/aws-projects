const AWS = require('aws-sdk');
AWS.config.update({ region: 'ca-central-1' });

const db = new AWS.DynamoDB.DocumentClient();

const tbName = process.env.TABLE_NAME;

exports.handler = async (event) => {
  const userid = event.pathParameters.userid;
  const data = await db
    .get({
      TableName: tbName,
      Key: {
        userid,
      },
    })
    .promise();
  if (data.Item) {
    return {
      statusCode: 200,
      body: JSON.stringify(data.Item),
    };
  } else {
    throw new Error('User not found');
  }
};
