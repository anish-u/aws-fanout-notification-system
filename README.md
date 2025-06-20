# AWS SNS SQS Fanout Notification System

This project implements an event-driven fan-out architecture using **AWS CDK (TypeScript)**. It uses **Amazon SNS** to broadcast messages to multiple **SQS queues**, each processed by an independent **Lambda consumer**. Filtering is done via **SNS message attributes**, allowing each queue to selectively receive messages.

## Project Structure

```bash
aws-fanout-notification-system/
├── bin                                             # CDK app definition
│   └──  aws-fanout-notification-system.ts
├── src
│   └──  constructs
│         └──  consumer-lambda.ts                   # Lambda function setup
│         └──  notification-queue.ts                # SQS + subscriptions setup
│         └──  notification-topic.ts                # SNS topic setup
│   └──  lambda
│         └──  emailHandler.ts                      # Email consumer
│         └──  pushHandler.ts                       # Push consumer
│         └──  smsHandler.ts                        # SMS consumer
├── stack/
│   └── aws-fanout-notification-system-stack.ts     # CDK root stack
├── cdk.json
└── package.json
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [AWS CDK v2](https://docs.aws.amazon.com/cdk/v2/guide/home.html)
- AWS CLI configured with sufficient permissions

### 1. Install dependencies

```bash
npm install
```

### 2. Bootstrap and deploy the CDK stack

```bash
cdk bootstrap
cdk deploy
```

This will provision:

- 1 SNS Topic
  - NotificationTopic
- 3 SQS Queues (one per notification type)
  - EmailQueue
  - SmsQueue
  - PushQueue
- 3 Dead-Letter Queues (DLQs)
  - EmailDeadLetterQueue
  - SmsDeadLetterQueue
  - PushDeadLetterQueue
- 3 Lambda Functions
  - EmailLambda
  - SmsLambda
  - PushLambda
- 4 Log Groups (one per Lambda function + log retention):
  - /aws/lambda/EmailLambda
  - /aws/lambda/SmsLambda
  - /aws/lambda/PushLambda
  - log group for log retention

## Working

### Testing

I have created a simple Bash script to test the SNS → SQS → Lambda fan-out architecture by publishing messages to the SNS topic with different notification-type attributes.

You can find it in the project root as `test-publish.sh`.

Update your `account-id` in topic ARN before running the script.

```bash
chmod +x test-publish.sh
./test-publish.sh  # Sends all three notification
./test-publish.sh email sms # Sends notification through email & sms
./test-publish.sh push # Sends push notification
```

This script will:

- Publish a test message to the SNS topic
- Include a notification-type attribute (e.g., email)
- Trigger only the matching SQS queue and its corresponding Lambda function (due to SNS filter policies)

Open CloudWatch Logs for /aws/lambda/EmailLambda, SmsLambda, or PushLambda to verify processing.

## Cleanup

If you're done testing or using this in a temporary environment:

```bash
cdk destroy
```

```
⚠️ Note: Since we are using CDK and logRetention, the log events inside CloudWatch log groups will expire automatically after the retention period (7 days). However, the log groups themselves are not deleted by default. To clean them up completely, you can use AWS CLI / AWS Console to delete all log groups with specific project tag (aws-fanout-notification-system).
```
