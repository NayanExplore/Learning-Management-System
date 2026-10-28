if (-not $env:JAVA_HOME -or -not (Test-Path $env:JAVA_HOME)) {
    if (Test-Path "C:\Program Files\Eclipse Adoptium\jdk-21.0.1.12-hotspot") {
        $env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.1.12-hotspot"
    } elseif (Test-Path "C:\Program Files\Java\jdk-21") {
        $env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
    }
}
$mvnCmd = Join-Path $PSScriptRoot "tools\apache-maven-3.9.6\bin\mvn.cmd"
if (-not (Test-Path $mvnCmd)) {
    $mvnCmd = "mvn"
}
& $mvnCmd @args
