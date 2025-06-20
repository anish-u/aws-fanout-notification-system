#!/bin/bash

# Make sure to update this with your actual topic ARN
TOPIC_ARN="arn:aws:sns:us-west-2:<account-id>:NotificationTopic"

# Collect all arguments as notification types
NOTIFICATION_TYPES=("$@")

# Default to 'email' if none provided
if [ ${#NOTIFICATION_TYPES[@]} -eq 0 ]; then
  NOTIFICATION_TYPES=("email" "push" "sms")
fi

# Convert Bash array to JSON string
JSON_ARRAY=$(printf '"%s",' "${NOTIFICATION_TYPES[@]}")
JSON_ARRAY="[${JSON_ARRAY%,}]"
JSON_ARRAY=$(printf '%s' "$JSON_ARRAY" | jq -R .)

echo "Publishing to SNS Topic with notification-types=$JSON_ARRAY"

aws sns publish \
  --topic-arn "$TOPIC_ARN" \
  --message "Test message for notification types: ${NOTIFICATION_TYPES[*]}" \
  --message-attributes "{
    \"notification-type\": {
      \"DataType\": \"String.Array\",
      \"StringValue\": $JSON_ARRAY
    }
  }"
