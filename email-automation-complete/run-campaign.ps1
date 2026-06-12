param([string]$PromptFile)

$ErrorActionPreference = 'Continue'
$projectDir = Split-Path $PromptFile -Parent
$startTime = Get-Date

# ============================================================
# PRE-FLIGHT: build compact NO_CONTACT list in PowerShell so
# Claude doesn't spend tokens reading + parsing 3 CSV files.
# ============================================================
$noContact = New-Object System.Collections.Generic.List[string]

function Add-CsvColumn {
    param($Path, $NameCol, $EmailCol)
    if (-not (Test-Path $Path)) { return }
    try {
        $rows = Import-Csv $Path
        foreach ($r in $rows) {
            $n = $r.$NameCol; $e = $r.$EmailCol
            if ($n) { $script:noContact.Add($n.Trim()) }
            if ($e) { $script:noContact.Add($e.Trim().ToLower()) }
        }
    } catch {}
}

Add-CsvColumn "$projectDir\outreach_log.csv"   'business_name' 'public_email'
Add-CsvColumn "$projectDir\rejected_leads.csv" 'business_name' 'email'
Add-CsvColumn "$projectDir\do_not_contact.csv" 'business_name' 'email'

$unique = $noContact | Sort-Object -Unique
$listFile = "$projectDir\no-contact-list.txt"
$unique | Set-Content $listFile -Encoding UTF8
Write-Host ("[setup] Deduplication list built: {0} blocked names/emails" -f $unique.Count) -ForegroundColor DarkGray

# Clean stale cache files here (not Claude's job)
foreach ($f in @("$projectDir\email-search-queries.json", "$projectDir\leads-to-process.json")) {
    if (Test-Path $f) { Remove-Item $f -Force }
}

# ============================================================
# RUN CLAUDE with live streaming output
#   --print                : non-interactive, exits when done
#   --model sonnet         : fast + capable, cheaper than opus
#   --max-budget-usd 3     : hard cost ceiling per run
# ============================================================
$prompt = [System.IO.File]::ReadAllText($PromptFile)

$prompt | claude --dangerously-skip-permissions --print --verbose --output-format stream-json --model sonnet --fallback-model claude-haiku-4-5 --max-budget-usd 3 | ForEach-Object {
    try {
        $obj = $_ | ConvertFrom-Json -ErrorAction Stop

        if ($obj.type -eq 'assistant') {
            foreach ($block in $obj.message.content) {
                if ($block.type -eq 'text') {
                    Write-Host $block.text -NoNewline
                }
                elseif ($block.type -eq 'tool_use') {
                    $name = $block.name
                    $hint = ''
                    if ($block.input.query)       { $hint = $block.input.query }
                    elseif ($block.input.to)      { $hint = "draft -> " + $block.input.to }
                    elseif ($block.input.file_path) { $hint = Split-Path $block.input.file_path -Leaf }
                    elseif ($block.input.command) { $hint = ($block.input.command -split "`n")[0] }
                    if ($hint.Length -gt 80) { $hint = $hint.Substring(0,77) + '...' }
                    Write-Host ""
                    Write-Host ("  [{0}] {1}" -f $name, $hint) -ForegroundColor Cyan
                }
            }
        }
        elseif ($obj.type -eq 'result') {
            $elapsed = (Get-Date) - $startTime
            Write-Host ""
            Write-Host "------------------------------------------------------------" -ForegroundColor DarkGray
            if ($obj.total_cost_usd) {
                Write-Host ("  Run cost: `${0:N3}   Time: {1:mm\:ss}" -f $obj.total_cost_usd, $elapsed) -ForegroundColor DarkGray
            }
            if ($obj.is_error) {
                Write-Host "  Campaign ended with an ERROR - see output above." -ForegroundColor Red
                exit 1
            }
        }
    } catch {}
}

exit $LASTEXITCODE
