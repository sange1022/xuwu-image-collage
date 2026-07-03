# 戌無图片拼图

面向 Windows 10/11 x64 的离线图片拼图工具，界面与“图片加水印”保持一致：左侧导入与排序、中间实时预览、右侧设置与导出。

## 功能

- 1–6 张图片，多种均分与不对称模板
- 1:1、3:4、9:16、2:3、4:3、3:2、16:9 比例
- 间隙与圆角拉杆、背景色、图片顺序调整
- JPG、PNG、WebP 高清导出
- 选择保存位置、打开导出位置
- 拖入图片或整个文件夹，全部本机处理

## Windows 构建安装包

安装 [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) 与 [Inno Setup 6](https://jrsoftware.org/isdl.php)，然后在 PowerShell 执行：

```powershell
.\build-windows.ps1
```

产物位于 `releases`。推荐安装包名为 `XuwuImageCollage-1.0-Setup-Win10-x64.exe`；英文文件名可减少聊天软件和浏览器误拦截。若未安装 Inno Setup，脚本仍会生成免安装 ZIP。

macOS 维护机也可安装 NSIS 后执行 `makensis installer/ImageCollage.nsi`，直接生成同名安装版 EXE。

## 使用

添加或拖入 1–6 张图片，使用“上移/下移”调整顺序，在右侧选择画布比例和模板。间隙、圆角与背景色会实时反映到预览；选择导出目录、尺寸和格式后点击“导出拼图”。
