import { SQSEvent, SQSHandler } from "aws-lambda";

export const handler: SQSHandler = async (event: SQSEvent): Promise<void> => {
  console.log(
    `[Lambda Execution Start] Processing ${event.Records.length} SQS messages`
  );

  for (const record of event.Records) {
    try {
      const snsMessage = JSON.parse(record.body);

      console.log(`[Push Message Received]`);
      console.log(`Message ID: ${record.messageId}`);
      console.log(`Message: ${snsMessage.Message}`);
      console.log(
        `Attributes: ${JSON.stringify(snsMessage.MessageAttributes, null, 2)}`
      );
    } catch (error) {
      console.error(`[Error] Failed to process message ID ${record.messageId}`);
      console.error(error);

      throw error;
    }
  }

  console.log(`[Lambda Execution Complete]`);
};
