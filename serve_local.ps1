param(
  [int]$port = 8000,
  [string]$hostIP = ''
)
$root = Get-Location

# determine host IP if not provided (first non-loopback IPv4)
if ([string]::IsNullOrEmpty($hostIP)) {
  try {
    $addresses = [System.Net.Dns]::GetHostAddresses([System.Net.Dns]::GetHostName()) | Where-Object { $_.AddressFamily -eq 'InterNetwork' -and -not $_.IsLoopback }
    if ($addresses.Length -gt 0) { $hostIP = $addresses[0].ToString() } else { $hostIP = '127.0.0.1' }
  } catch { $hostIP = '127.0.0.1' }
}

$listener = New-Object System.Net.HttpListener
$prefix = "http://${hostIP}:$port/"
$listener.Prefixes.Add($prefix)
try {
  $listener.Start()
  Write-Host "Serving $root on $prefix"
} catch {
  Write-Host "Failed to start listener on $prefix : $_"
  exit 1
}
while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $path = $req.Url.AbsolutePath
    if ($path -eq '/') { $path = '/index.html' }
    $file = Join-Path $root ($path.TrimStart('/','\\'))
    if (-not (Test-Path $file)) {
      $ctx.Response.StatusCode = 404
      $buf = [Text.Encoding]::UTF8.GetBytes('Not Found')
      $ctx.Response.OutputStream.Write($buf,0,$buf.Length)
      $ctx.Response.Close()
      continue
    }
    $bytes = [System.IO.File]::ReadAllBytes($file)
    $ext = [System.IO.Path]::GetExtension($file).ToLower()
    $mime = switch ($ext) {
      '.html' { 'text/html' }
      '.css' { 'text/css' }
      '.js' { 'application/javascript' }
      '.png' { 'image/png' }
      '.jpg' { 'image/jpeg' }
      '.jpeg' { 'image/jpeg' }
      '.gif' { 'image/gif' }
      '.json' { 'application/json' }
      '.svg' { 'image/svg+xml' }
      default { 'application/octet-stream' }
    }
    $ctx.Response.ContentType = $mime
    $ctx.Response.ContentLength64 = $bytes.Length
    $ctx.Response.OutputStream.Write($bytes,0,$bytes.Length)
    $ctx.Response.Close()
  } catch {
    # ignore errors from aborted requests
  }
}
