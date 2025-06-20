import { Duration } from "aws-cdk-lib";
import { Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import path from "path";

export const createConsumerLambda = (
  scope: Construct,
  name: string,
  queue: Queue,
  handlerFileName: string
) => {
  const consumerFunction = new NodejsFunction(scope, `${name}Lambda`, {
    runtime: Runtime.NODEJS_20_X,
    functionName: `${name}Lambda`,
    handler: "handler",
    entry: path.join(__dirname, `../lambda/${handlerFileName}.ts`),
    environment: {
      QUEUE_NAME: queue.queueName,
    },
    logRetention: RetentionDays.ONE_WEEK,
  });

  consumerFunction.addEventSource(
    new SqsEventSource(queue, {
      batchSize: 5,
      maxBatchingWindow: Duration.seconds(5),
    })
  );

  queue.grantConsumeMessages(consumerFunction);

  return consumerFunction;
};
