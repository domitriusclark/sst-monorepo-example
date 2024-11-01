import { Resource } from "sst";
import { Util } from "@monorepo-template/core/utils";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const params = {
    TableName: Resource.Notes.name,
    Key: {
      userId: "123",
      noteId: event.pathParameters?.noteId,
    },
  };

  await dynamoDb.send(new DeleteCommand(params));

  return JSON.stringify({ success: true });
});
