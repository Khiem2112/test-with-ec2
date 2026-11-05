param(
    [string[]]$TaskFiles
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not $TaskFiles -or $TaskFiles.Count -eq 0) {
    Write-Host "[Task Runner] No task files specified. Usage: .\.agents\skills\task-runner\scripts\run_tasks.ps1 -TaskFiles task/TASK-01-..., task/TASK-02-..."
    exit 1
}

foreach ($taskFile in $TaskFiles) {
    $taskFile = $taskFile.Trim().Trim('"', "'", ',')
    if (-not (Test-Path $taskFile)) {
        Write-Error "[Task Runner] Task file not found: $taskFile"
        exit 1
    }

    Write-Host "[Task Runner] Launching fresh session for task: $taskFile"
    $prompt = "Execute task at $taskFile following .agents/skills/task-runner/SKILL.md strictly. Single-agent execution only: do not invoke child subagents. Do not use any emojis or icons anywhere in code, comments or commit messages. Do not use numbered comment chains. Run npm run check and ensure exit code 0. Update checklist [x] and Status: Complete in $taskFile and update task/README.md. Stage touched source files and stage task files using git add -f $taskFile task/README.md, then create a clean git commit upon pass."

    agy -p $prompt --model gemini-3.8-flash-high
    if ($LASTEXITCODE -ne 0) {
        Write-Error "[Task Runner] Task execution exited with code $LASTEXITCODE on $taskFile. Halting batch sequence."
        exit $LASTEXITCODE
    }

    Write-Host "[Task Runner] Task finished successfully: $taskFile"
}

Write-Host "[Task Runner] All batch tasks executed and committed successfully."

