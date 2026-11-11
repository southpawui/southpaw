#!/bin/bash
# Block deletion of screenshot files — user must confirm before cleanup.

set -e

input=$(cat)
command=$(echo "$input" | jq -r '.tool_input.command // ""')

if echo "$command" | grep -qE "rm.*__screenshots__"; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "BLOCKED: Cannot delete screenshots. The user must review and confirm before cleanup."
    }
  }'
  exit 0
fi

exit 0
