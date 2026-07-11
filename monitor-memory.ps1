# monitor-memory.ps1
while ($true) {
    $proc = Get-Process node -ErrorAction SilentlyContinue
    if ($proc) {
        $proc | ForEach-Object {
            $mb = [math]::Round($_.WorkingSet64 / 1MB, 2)
            "$(Get-Date -Format 'HH:mm:ss') - PID $($_.Id): $mb MB" | Out-File -Append memory-log.txt
        }
    }
    Start-Sleep -Seconds 30
}
