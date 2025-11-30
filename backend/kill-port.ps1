# Kill all processes using port 5001
$port = 5001
$processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($processes) {
    Write-Host "Found processes using port $port :"
    foreach ($processId in $processes) {
        $proc = Get-Process -Id $processId -ErrorAction SilentlyContinue
        if ($proc) {
            Write-Host "  PID: $processId - $($proc.ProcessName)"
        }
    }
    Write-Host "`nKilling processes..."
    foreach ($processId in $processes) {
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        Write-Host "  Killed PID: $processId"
    }
    Write-Host "`n✅ Port $port is now free!"
} else {
    Write-Host "No processes found using port $port"
}

