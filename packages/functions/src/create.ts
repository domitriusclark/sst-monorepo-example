/*

What are we doing here?
- Parse the input from the event.body. This represents the HTTP request body.
- It contains the contents of the note, as a string — content.
- It also contains an attachment, if one exists. It’s the filename of a file that will be uploaded to our S3 bucket.
- We can access our linked DynamoDB table through Resource.Notes.name using the SST SDK. Here, Notes in Resource.Notes, is the name of our Table component from the Create a DynamoDB Table in SST chapter. By doing link: [table] earlier in this chapter, we are allowing our API to access our table.
- The userId is the id for the author of the note. For now we are hardcoding it to 123. Later we’ll be setting this based on the authenticated user.
- Make a call to DynamoDB to put a new object with a generated noteId and the current date as the createdAt.
- And if the DynamoDB call fails then return an error with the HTTP status code 500.

*/

import * as uuid from "uuid";
import { Resource } from "sst";
import { Util } from "@monorepo-template/core/utils";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  let data = {
    content: "",
    attachment: "",
  };

  if (event.body != null) {
    data = JSON.parse(event.body);
  }

  const params = {
    TableName: Resource.Notes.name,
    Item: {
      // The attributes of the item to be created
      userId: "123", // The id of the author
      noteId: uuid.v1(), // A unique uuid
      content: data.content, // Parsed from request body
      attachment: data.attachment, // Parsed from request body
      createdAt: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.send(new PutCommand(params));

  return JSON.stringify(params.Item);
});
