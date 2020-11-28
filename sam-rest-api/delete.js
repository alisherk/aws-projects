const AWS = require('aws-sdk');
AWS.config.update({ region: 'ca-central-1' });

const db = new AWS.DynamoDB.DocumentClient();

const tbName = process.env.TABLE_NAME;

exports.handler = async (event) => {
  const userid = event.pathParameters.userid;
  db.delete({
    TableName: tbName,
    Key: {
      userid,
    },
  }).promise();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'User deleted sucessfully',
    }),
  };
};
