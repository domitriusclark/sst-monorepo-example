import { Resource } from "sst";
import { Util } from "@monorepo-template/core/utils";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const params = {
    TableName: Resource.Notes.name,
    Key: {
      userId: "123",
      noteId: event.pathParameters?.noteId,
    },
  };

  const { Item } = await dynamoDb.send(new GetCommand(params));

  if (Item) {
    throw new Error("Item not found.");
  }

  // Return the retrieved item
  return JSON.stringify(Item);
});
