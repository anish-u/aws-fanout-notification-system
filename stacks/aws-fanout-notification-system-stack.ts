import { Stack, StackProps, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";

import { createNotificationTopic } from "../src/constructs/notification-topic";
import { createNotificationQueue } from "../src/constructs/notification-queue";

export class AwsFanoutNotificationSystemStack extends Stack {
  private readonly TOPIC_NAME = "Notification";

  private readonly EMAIL_QUEUE_NAME = "Email";
  private readonly EMAIL_HANDLER_FILE_NAME = "emailHandler";

  private readonly SMS_QUEUE_NAME = "SMS";
  private readonly SMS_HANDLER_FILE_NAME = "smsHandler";

  private readonly PUSH_QUEUE_NAME = "Push";
  private readonly PUSH_HANDLER_FILE_NAME = "pushHandler";

  private readonly PROJECT_TAG_KEY = "project";
  private readonly PROJECT_TAG_VALUE = "aws-fanout-notification-system";

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    Tags.of(this).add(this.PROJECT_TAG_KEY, this.PROJECT_TAG_VALUE);

    const notificationTopic = createNotificationTopic(this, this.TOPIC_NAME);

    createNotificationQueue(
      this,
      this.EMAIL_QUEUE_NAME,
      notificationTopic,
      this.EMAIL_HANDLER_FILE_NAME
    );

    createNotificationQueue(
      this,
      this.SMS_QUEUE_NAME,
      notificationTopic,
      this.SMS_HANDLER_FILE_NAME
    );

    createNotificationQueue(
      this,
      this.PUSH_QUEUE_NAME,
      notificationTopic,
      this.PUSH_HANDLER_FILE_NAME
    );
  }
}
