$toolsDir = Join-Path $PSScriptRoot "tools"
if (-not (Test-Path $toolsDir)) {
    New-Item -ItemType Directory -Path $toolsDir | Out-Null
}

$mavenZip = Join-Path $toolsDir "maven.zip"
$mavenUrls = @(
    "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip",
    "https://dlcdn.apache.org/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip"
)

$downloaded = $false
foreach ($url in $mavenUrls) {
    try {
        Write-Host "Trying to download Maven from: $url"
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri $url -OutFile $mavenZip -TimeoutSec 60
        $downloaded = $true
        Write-Host "Downloaded successfully!"
        break
    } catch {
        Write-Host "Failed to download from ${url}: $_"
    }
}

if ($downloaded) {
    Expand-Archive -Path $mavenZip -DestinationPath $toolsDir -Force
    Remove-Item $mavenZip -Force
    Write-Host "Maven installed in $toolsDir"
}
