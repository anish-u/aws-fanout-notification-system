import { Duration, RemovalPolicy } from "aws-cdk-lib";
import { SubscriptionFilter, Topic } from "aws-cdk-lib/aws-sns";
import { SqsSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import { createConsumerLambda } from "./consumer-lambda";

export const createNotificationQueue = (
  scope: Construct,
  name: string,
  topic: Topic,
  handlerFileName: string
) => {
  const deadLetterQueue = new Queue(scope, `${name}DeadLetterQueue`, {
    queueName: `${name}DeadLetterQueue`,
    retentionPeriod: Duration.days(7),
    removalPolicy: RemovalPolicy.DESTROY,
  });

  const queue = new Queue(scope, `${name}Queue`, {
    queueName: `${name}Queue`,
    visibilityTimeout: Duration.seconds(30),
    retentionPeriod: Duration.days(7),
    deadLetterQueue: {
      queue: deadLetterQueue,
      maxReceiveCount: 3,
    },
  });

  topic.addSubscription(
    new SqsSubscription(queue, {
      filterPolicy: {
        "notification-type": SubscriptionFilter.stringFilter({
          allowlist: [name.toLocaleLowerCase()],
        }),
      },
    })
  );

  createConsumerLambda(scope, name, queue, handlerFileName);
};
