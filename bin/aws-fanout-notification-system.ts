import { App } from "aws-cdk-lib";

import { AwsFanoutNotificationSystemStack } from "../stacks/aws-fanout-notification-system-stack";

const app = new App();
new AwsFanoutNotificationSystemStack(app, "AwsFanoutNotificationSystemStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
