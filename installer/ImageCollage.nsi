Unicode True
Name "戌無图片拼图"
OutFile "..\releases\戌無图片拼图1.0-安装版-x64.exe"
InstallDir "$LOCALAPPDATA\Programs\戌無图片拼图"
RequestExecutionLevel user
SetCompressor /SOLID lzma

Page directory
Page instfiles
UninstPage uninstConfirm
UninstPage instfiles

Section "安装"
  SetOutPath "$INSTDIR"
  File /r "..\dist\win-x64\*"
  WriteUninstaller "$INSTDIR\卸载.exe"
  CreateDirectory "$SMPROGRAMS\戌無图片拼图"
  CreateShortcut "$SMPROGRAMS\戌無图片拼图\戌無图片拼图.lnk" "$INSTDIR\戌無图片拼图.exe"
  CreateShortcut "$DESKTOP\戌無图片拼图.lnk" "$INSTDIR\戌無图片拼图.exe"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\XuwuImageCollage" "DisplayName" "戌無图片拼图"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\XuwuImageCollage" "DisplayVersion" "1.0"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\XuwuImageCollage" "Publisher" "戌無营造"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\XuwuImageCollage" "UninstallString" '"$INSTDIR\卸载.exe"'
SectionEnd

Section "Uninstall"
  Delete "$DESKTOP\戌無图片拼图.lnk"
  RMDir /r "$SMPROGRAMS\戌無图片拼图"
  RMDir /r "$INSTDIR"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\XuwuImageCollage"
SectionEnd
