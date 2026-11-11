#!/bin/bash
# Block destructive commands that could damage the working tree.

set -e

input=$(cat)
command=$(echo "$input" | jq -r '.tool_input.command // ""')

# Block rm -rf on project directories
if echo "$command" | grep -qE 'rm\s+-rf\s+(/|\./)'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "BLOCKED: rm -rf on project directories is not allowed."
    }
  }'
  exit 0
fi

# Block git reset --hard
if echo "$command" | grep -q "git reset --hard"; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "BLOCKED: git reset --hard is destructive. Use git stash or ask the user."
    }
  }'
  exit 0
fi

# Block git push --force to main
if echo "$command" | grep -qE "git push.*--force.*(main|master)"; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "BLOCKED: Force push to main/master is never allowed."
    }
  }'
  exit 0
fi

# Block --no-verify on git commands
if echo "$command" | grep -q "\-\-no-verify"; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "BLOCKED: --no-verify is never allowed. Fix the issue instead."
    }
  }'
  exit 0
fi

# Allow
exit 0
