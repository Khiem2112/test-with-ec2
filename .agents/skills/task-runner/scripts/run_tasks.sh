#!/usr/bin/env bash

set -euo pipefail

if [ "$#" -eq 0 ]; then
  echo "[Task Runner] No task files specified."
  echo "Usage: ./.agents/skills/task-runner/scripts/run_tasks.sh task/TASK-01-... [task/TASK-02-...]"
  exit 1
fi

for task_file in "$@"; do
  # Normalize task file string and remove potential comma or quote wrapping
  clean_task_file=$(echo "$task_file" | tr -d ',"'"'")

  if [ ! -f "$clean_task_file" ]; then
    echo "[Task Runner] Error: Task file not found: $clean_task_file" >&2
    exit 1
  fi

  echo "[Task Runner] Launching fresh session for task: $clean_task_file"

  prompt="Execute task at $clean_task_file following .agents/skills/task-runner/SKILL.md strictly. Single-agent execution only: do not invoke child subagents. Do not use any emojis or icons anywhere in code, comments or commit messages. Do not use numbered comment chains. Run npm run check and ensure exit code 0. Update checklist [x] and Status: Complete in $clean_task_file and update task/README.md. Stage touched source files and stage task files using git add -f $clean_task_file task/README.md, then create a clean git commit upon pass."

  agy -p "$prompt" --model gemini-3.8-flash-high

  exit_code=$?
  if [ "$exit_code" -ne 0 ]; then
    echo "[Task Runner] Error: Task execution exited with code $exit_code on $clean_task_file. Halting sequence." >&2
    exit "$exit_code"
  fi

  echo "[Task Runner] Task finished successfully: $clean_task_file"
done

echo "[Task Runner] All batch tasks executed and committed successfully."
