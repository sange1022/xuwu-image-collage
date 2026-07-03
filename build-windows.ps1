$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

dotnet test ".\tests\ImageCollage.Core.Tests\ImageCollage.Core.Tests.csproj" -c Release
dotnet publish ".\src\ImageCollage.App\ImageCollage.App.csproj" `
  -c Release -r win-x64 --self-contained true `
  -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -p:DebugType=None `
  -o ".\dist\win-x64"

New-Item -ItemType Directory -Force ".\releases" | Out-Null
$zip = ".\releases\戌無图片拼图1.0-win-x64.zip"
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path ".\dist\win-x64\*" -DestinationPath $zip

$iscc = "${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe"
if (Test-Path $iscc) {
  & $iscc ".\installer\ImageCollage.iss"
  Write-Host "安装包：releases\戌無图片拼图1.0-安装版-x64.exe" -ForegroundColor Green
} else {
  Write-Warning "未找到 Inno Setup 6；已生成免安装 ZIP。安装 Inno Setup 后再次运行即可生成安装版。"
}
Write-Host "免安装版：$zip" -ForegroundColor Green
