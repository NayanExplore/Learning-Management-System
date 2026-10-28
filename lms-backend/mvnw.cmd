@echo off
if not defined JAVA_HOME set JAVA_HOME=C:\Program Files\Java\jdk-21
set MAVEN_CMD="%~dp0..\tools\apache-maven-3.9.6\bin\mvn.cmd"
if not exist %MAVEN_CMD% set MAVEN_CMD="%~dp0tools\apache-maven-3.9.6\bin\mvn.cmd"
%MAVEN_CMD% %*
