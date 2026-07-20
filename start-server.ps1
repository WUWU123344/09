# PowerShell HTTP服务器脚本
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8000/")
$listener.Start()

Write-Host "Server started, access address: http://localhost:8000"
Write-Host "Press Ctrl+C to stop server"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Get requested path
        $path = $request.Url.LocalPath
        if ($path -eq "/") {
            $path = "/index.html"
        }
        
        # Build file path
        $filePath = Join-Path $PSScriptRoot $path.Substring(1)
        
        # Check if file exists
        if (Test-Path $filePath -PathType Leaf) {
            # Read file content
            $content = Get-Content $filePath -Raw
            
            # Set content type
            switch ([System.IO.Path]::GetExtension($filePath)) {
                ".html" {
                    $response.ContentType = "text/html"
                }
                ".css" {
                    $response.ContentType = "text/css"
                }
                ".js" {
                    $response.ContentType = "application/javascript"
                }
                default {
                    $response.ContentType = "application/octet-stream"
                }
            }
            
            # Write response
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        } else {
            # File not found, return 404
            $response.StatusCode = 404
            $response.ContentType = "text/html"
            $content = "<html><body><h1>404 Not Found</h1></body></html>"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        
        $response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Dispose()
    Write-Host "Server stopped"
}