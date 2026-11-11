#!/bin/bash
# Block git commit on component files if LOG.md wasn't also modified.

set -e

input=$(cat)
command=$(echo "$input" | jq -r '.tool_input.command // ""')

if echo "$command" | grep -q "git commit"; then
  # Check if any component .tsx files are staged
  staged_components=$(cd "${CLAUDE_PROJECT_DIR}" && git diff --cached --name-only 2>/dev/null | grep "packages/ui/src/components/.*\.tsx$" | head -1)

  if [ -n "$staged_components" ]; then
    # Extract the component directory
    component_dir=$(echo "$staged_components" | sed 's|/[^/]*\.tsx$||')

    # Check if LOG.md in that directory is also staged
    log_staged=$(cd "${CLAUDE_PROJECT_DIR}" && git diff --cached --name-only 2>/dev/null | grep "${component_dir}/LOG.md" | head -1)

    if [ -z "$log_staged" ]; then
      jq -n --arg dir "$component_dir" '{
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: ("BLOCKED: Component files changed but LOG.md not staged. Update " + $dir + "/LOG.md before committing.")
        }
      }'
      exit 0
    fi
  fi
fi

exit 0
