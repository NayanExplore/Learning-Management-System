if ($env:JAVA_HOME -and $env:JAVA_HOME.EndsWith("\bin")) {
    $env:JAVA_HOME = $env:JAVA_HOME.Substring(0, $env:JAVA_HOME.Length - 4)
}
if (-not $env:JAVA_HOME -or -not (Test-Path "$env:JAVA_HOME\bin\javac.exe")) {
    if (Test-Path "C:\Program Files\Java\jdk-21\bin\javac.exe") {
        $env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
    } elseif (Test-Path "C:\Program Files\Eclipse Adoptium\jdk-21.0.1.12-hotspot\bin\javac.exe") {
        $env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.1.12-hotspot"
    }
}
$mvnCmd = Join-Path $PSScriptRoot "..\tools\apache-maven-3.9.6\bin\mvn.cmd"
if (-not (Test-Path $mvnCmd)) {
    $mvnCmd = Join-Path $PSScriptRoot "tools\apache-maven-3.9.6\bin\mvn.cmd"
}
& $mvnCmd @args
