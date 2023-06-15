"use strict";
const env = process.env.environment;

module.exports.hello = async (event) => {
  console.log(process.env)
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v2.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };
};
