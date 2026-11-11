#!/bin/bash
# Block git commit if pnpm verify hasn't been run in this session.
# This prevents committing without verification.

set -e

input=$(cat)
command=$(echo "$input" | jq -r '.tool_input.command // ""')

# Only check git commit commands
if echo "$command" | grep -q "git commit"; then
  # Check if verify was run by looking for recent screenshots
  # (pnpm verify always generates screenshots as its last step)
  screenshot_dir="${CLAUDE_PROJECT_DIR}/e2e/__screenshots__"

  if [ -d "$screenshot_dir" ]; then
    # Check if any screenshot was modified in the last 10 minutes
    recent=$(find "$screenshot_dir" -name "*.png" -mmin -10 2>/dev/null | head -1)
    if [ -z "$recent" ]; then
      jq -n '{
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: "BLOCKED: No recent screenshots found. Run pnpm verify <component> before committing."
        }
      }'
      exit 0
    fi
  fi
fi

# Allow
exit 0
