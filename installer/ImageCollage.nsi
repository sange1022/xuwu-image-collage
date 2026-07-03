Unicode True
!include "MUI2.nsh"
Name "戌無图片拼图"
OutFile "..\releases\XuwuImageCollage-1.0.1-Setup-Win10-x64.exe"
InstallDir "$LOCALAPPDATA\Programs\戌無图片拼图"
RequestExecutionLevel user
SetCompressor /SOLID lzma
!define MUI_ABORTWARNING
!define MUI_FINISHPAGE_RUN "$INSTDIR\XuwuImageCollage.exe"
!define MUI_FINISHPAGE_RUN_TEXT "启动戌無图片拼图"
VIProductVersion "1.0.1.0"
VIAddVersionKey "ProductName" "Xuwu Image Collage"
VIAddVersionKey "FileDescription" "Xuwu Image Collage Setup for Windows 10 x64"
VIAddVersionKey "CompanyName" "Xuwu Creative"
VIAddVersionKey "FileVersion" "1.0.1.0"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "SimpChinese"

Section "安装"
  SetOutPath "$INSTDIR"
  File /r "..\dist\win-x64\*"
  WriteUninstaller "$INSTDIR\卸载.exe"
  CreateDirectory "$SMPROGRAMS\戌無图片拼图"
  CreateShortcut "$SMPROGRAMS\戌無图片拼图\戌無图片拼图.lnk" "$INSTDIR\XuwuImageCollage.exe"
  CreateShortcut "$DESKTOP\戌無图片拼图.lnk" "$INSTDIR\XuwuImageCollage.exe"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\XuwuImageCollage" "DisplayName" "戌無图片拼图"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\XuwuImageCollage" "DisplayVersion" "1.0.1"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\XuwuImageCollage" "Publisher" "戌無营造"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\XuwuImageCollage" "UninstallString" '"$INSTDIR\卸载.exe"'
SectionEnd

Section "Uninstall"
  Delete "$DESKTOP\戌無图片拼图.lnk"
  RMDir /r "$SMPROGRAMS\戌無图片拼图"
  RMDir /r "$INSTDIR"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\XuwuImageCollage"
SectionEnd
