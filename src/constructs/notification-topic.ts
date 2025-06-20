import { Topic } from "aws-cdk-lib/aws-sns";
import { Construct } from "constructs";

export const createNotificationTopic = (
  scope: Construct,
  name: string
): Topic => {
  return new Topic(scope, `${name}Topic`, {
    displayName: `${name} Topic`,
    topicName: `${name}Topic`,
  });
};
