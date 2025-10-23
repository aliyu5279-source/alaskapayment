# ========================================================
# ?? Supabase API Connectivity Tester (Auth + Database)
# ========================================================

$SUPABASE_URL = 'https://psafbcbhbidnbzfsccsu.supabase.co'
$SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzYWZiY2JoYmlkbmJ6ZnNjY3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTA1MTIsImV4cCI6MjA3NTE2NjUxMn0.RrZpBW6JujulVZ8H74k1EizS7dz3qHIwhyNJmoxwvKI'

Write-Host ''
Write-Host "?? Testing Supabase connectivity for project: $SUPABASE_URL"
Write-Host '--------------------------------------------------------'

# --- Step 1: Auth API ---
$authTestUrl = "$SUPABASE_URL/auth/v1/health"
try {
    $authResponse = Invoke-RestMethod -Uri $authTestUrl -Headers @{ 'apikey' = $SUPABASE_ANON_KEY }
    Write-Host "? Auth API reachable: $($authResponse.status)"
} catch {
    Write-Host '? Auth API unreachable.'
    Write-Host ('   Error: ' + $_.Exception.Message)
}

# --- Step 2: Database REST ---
$restTestUrl = "$SUPABASE_URL/rest/v1/orders?select=id`&limit=1"
try {
    $dbResponse = Invoke-RestMethod -Uri $restTestUrl `
        -Headers @{
            'apikey' = $SUPABASE_ANON_KEY
            'Authorization' = "Bearer $SUPABASE_ANON_KEY"
            'Content-Type' = 'application/json'
        } -Method Get
    Write-Host '? Database reachable. Example response:'
    $dbResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host '? Database REST API unreachable or restricted.'
    Write-Host ('   Error: ' + $_.Exception.Message)
}

# --- Step 3: Root URL ---
try {
    $rootResponse = Invoke-WebRequest -Uri $SUPABASE_URL -UseBasicParsing -ErrorAction Stop
    Write-Host ("? Supabase root reachable. Status code: " + $rootResponse.StatusCode)
} catch {
    Write-Host '? Cannot reach Supabase root URL.'
    Write-Host ('   Error: ' + $_.Exception.Message)
}
