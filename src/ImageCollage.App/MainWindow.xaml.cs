using System.Collections.ObjectModel;
using System.Diagnostics;
using System.IO;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using ImageCollage.Core;
using Microsoft.Win32;
using SixLabors.ImageSharp.PixelFormats;

namespace ImageCollage.App;

public partial class MainWindow : Window
{
    private static readonly HashSet<string> SupportedExtensions = new(StringComparer.OrdinalIgnoreCase)
        { ".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff" };
    private bool _loading = true;
    private CancellationTokenSource? _previewCts;
    public ObservableCollection<PhotoItem> Photos { get; } = [];

    public MainWindow()
    {
        InitializeComponent();
        DataContext = this;
        var settings = SettingsStore.Load();
        SelectRatio(settings.Ratio);
        GapSlider.Value = settings.Gap;
        RadiusSlider.Value = settings.Radius;
        BackgroundBox.Text = settings.Background;
        OutputFolderBox.Text = settings.OutputFolder;
        SelectByTag(LongEdgeCombo, settings.LongEdge.ToString());
        SelectByContent(FormatCombo, settings.Format);
        _loading = false;
        UpdateBackgroundSwatch();
        RefreshTemplates();
        Closing += (_, _) => SaveSettings();
    }

    private async void AddImages_Click(object sender, RoutedEventArgs e)
    {
        var dialog = new OpenFileDialog { Multiselect = true, Filter = "图片|*.jpg;*.jpeg;*.png;*.webp;*.bmp;*.tif;*.tiff|所有文件|*.*" };
        if (dialog.ShowDialog() == true) await AddFilesAsync(dialog.FileNames);
    }

    private async Task AddFilesAsync(IEnumerable<string> paths)
    {
        var files = paths.SelectMany(path => Directory.Exists(path) ? Directory.EnumerateFiles(path, "*.*", SearchOption.AllDirectories) : [path])
            .Where(path => SupportedExtensions.Contains(Path.GetExtension(path)))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Where(path => Photos.All(photo => !string.Equals(photo.Path, path, StringComparison.OrdinalIgnoreCase)))
            .Take(Math.Max(0, 6 - Photos.Count)).ToList();
        foreach (var file in files)
        {
            try
            {
                StatusBarText.Text = $"正在读取：{Path.GetFileName(file)}";
                Photos.Add(await CollageRenderer.LoadAsync(file));
            }
            catch (Exception ex) { StatusBarText.Text = $"跳过 {Path.GetFileName(file)}：{ex.Message}"; }
        }
        if (PhotoList.SelectedIndex < 0 && Photos.Count > 0) PhotoList.SelectedIndex = 0;
        EmptyHint.Visibility = Photos.Count == 0 ? Visibility.Visible : Visibility.Collapsed;
        ExportButton.IsEnabled = Photos.Count > 0;
        RefreshTemplates();
        await RefreshPreviewAsync();
        StatusBarText.Text = Photos.Count == 6 ? "已载入 6 张图片（单张拼图上限）" : $"已载入 {Photos.Count} 张图片";
    }

    private void Window_DragOver(object sender, DragEventArgs e) => e.Effects = e.Data.GetDataPresent(DataFormats.FileDrop) ? DragDropEffects.Copy : DragDropEffects.None;
    private async void Window_Drop(object sender, DragEventArgs e) { if (e.Data.GetData(DataFormats.FileDrop) is string[] paths) await AddFilesAsync(paths); }

    private async void Remove_Click(object sender, RoutedEventArgs e)
    {
        if (PhotoList.SelectedItem is not PhotoItem selected) return;
        var index = PhotoList.SelectedIndex;
        Photos.Remove(selected);
        PhotoList.SelectedIndex = Math.Min(index, Photos.Count - 1);
        RefreshTemplates(); await RefreshPreviewAsync();
        EmptyHint.Visibility = Photos.Count == 0 ? Visibility.Visible : Visibility.Collapsed;
        ExportButton.IsEnabled = Photos.Count > 0;
    }

    private async void Clear_Click(object sender, RoutedEventArgs e)
    {
        Photos.Clear(); PreviewImage.Source = null; EmptyHint.Visibility = Visibility.Visible; ExportButton.IsEnabled = false;
        RefreshTemplates(); await RefreshPreviewAsync(); StatusBarText.Text = "已清空图片列表";
    }

    private async void MoveUp_Click(object sender, RoutedEventArgs e)
    {
        var index = PhotoList.SelectedIndex; if (index <= 0) return;
        Photos.Move(index, index - 1); PhotoList.SelectedIndex = index - 1; await RefreshPreviewAsync();
    }

    private async void MoveDown_Click(object sender, RoutedEventArgs e)
    {
        var index = PhotoList.SelectedIndex; if (index < 0 || index >= Photos.Count - 1) return;
        Photos.Move(index, index + 1); PhotoList.SelectedIndex = index + 1; await RefreshPreviewAsync();
    }

    private void RefreshTemplates()
    {
        if (TemplateCombo is null) return;
        var oldId = (TemplateCombo.SelectedItem as CollageTemplate)?.Id;
        var choices = TemplateCatalog.ForCount(Math.Max(1, Photos.Count));
        TemplateCombo.ItemsSource = choices;
        TemplateCombo.SelectedItem = choices.FirstOrDefault(x => x.Id == oldId) ?? choices[0];
    }

    private async void Setting_Changed(object sender, EventArgs e)
    {
        if (_loading || !IsLoaded) return;
        UpdateBackgroundSwatch();
        await RefreshPreviewAsync();
    }

    private async Task RefreshPreviewAsync()
    {
        if (_loading || Photos.Count == 0 || TemplateCombo.SelectedItem is not CollageTemplate template) return;
        _previewCts?.Cancel();
        _previewCts = new CancellationTokenSource();
        try
        {
            var outputLongEdge = ReadLongEdge();
            var previewScale = 1100d / outputLongEdge;
            PreviewImage.Source = await CollageRenderer.PreviewAsync(Photos.ToList(), template, ReadRatio(),
                (int)Math.Round(GapSlider.Value * previewScale), (int)Math.Round(RadiusSlider.Value * previewScale),
                ReadBackground(), _previewCts.Token);
        }
        catch (OperationCanceledException) { }
        catch (Exception ex) { StatusBarText.Text = $"预览失败：{ex.Message}"; }
    }

    private CanvasRatio ReadRatio() => CanvasRatio.Parse(((RatioCombo.SelectedItem as ComboBoxItem)?.Tag?.ToString()) ?? "3:4");
    private int ReadLongEdge() => int.Parse(((LongEdgeCombo.SelectedItem as ComboBoxItem)?.Tag?.ToString()) ?? "2400");
    private string ReadFormat() => (FormatCombo.SelectedItem as ComboBoxItem)?.Content?.ToString() ?? "PNG";

    private Rgba32 ReadBackground()
    {
        var text = BackgroundBox.Text.Trim().TrimStart('#');
        if (text.Length != 6 || !byte.TryParse(text[0..2], System.Globalization.NumberStyles.HexNumber, null, out var r) ||
            !byte.TryParse(text[2..4], System.Globalization.NumberStyles.HexNumber, null, out var g) ||
            !byte.TryParse(text[4..6], System.Globalization.NumberStyles.HexNumber, null, out var b)) return new Rgba32(255, 255, 255);
        return new Rgba32(r, g, b);
    }

    private void UpdateBackgroundSwatch()
    {
        if (BackgroundSwatch is null) return;
        var c = ReadBackground(); BackgroundSwatch.Background = new SolidColorBrush(Color.FromRgb(c.R, c.G, c.B));
    }

    private void ChooseFolder_Click(object sender, RoutedEventArgs e)
    {
        var dialog = new OpenFolderDialog { Title = "选择导出文件夹", InitialDirectory = OutputFolderBox.Text };
        if (dialog.ShowDialog() == true) OutputFolderBox.Text = dialog.FolderName;
    }

    private void OpenOutputFolder_Click(object sender, RoutedEventArgs e)
    {
        try
        {
            var folder = OutputFolderBox.Text.Trim(); if (string.IsNullOrWhiteSpace(folder)) throw new ArgumentException("请先选择保存位置。");
            Directory.CreateDirectory(folder); Process.Start(new ProcessStartInfo(folder) { UseShellExecute = true });
        }
        catch (Exception ex) { MessageBox.Show(ex.Message, "无法打开导出位置", MessageBoxButton.OK, MessageBoxImage.Warning); }
    }

    private async void Export_Click(object sender, RoutedEventArgs e)
    {
        if (Photos.Count == 0 || TemplateCombo.SelectedItem is not CollageTemplate template) return;
        try
        {
            ExportButton.IsEnabled = false; ExportProgress.Value = 20; ExportStatus.Text = "正在生成高清拼图…";
            var folder = OutputFolderBox.Text.Trim(); Directory.CreateDirectory(folder);
            var format = ReadFormat(); var ext = format.ToLowerInvariant();
            var size = ExportSizing.FromLongEdge(ReadRatio(), ReadLongEdge());
            var path = Path.Combine(folder, $"拼图_{DateTime.Now:yyyyMMdd_HHmmss}.{ext}");
            await CollageRenderer.ExportAsync(Photos.ToList(), template, size.Width, size.Height, (int)GapSlider.Value,
                (int)RadiusSlider.Value, ReadBackground(), path, format, CancellationToken.None);
            ExportProgress.Value = 100; ExportStatus.Text = $"导出完成：{Path.GetFileName(path)}"; StatusBarText.Text = $"已保存到 {path}";
            SaveSettings();
        }
        catch (Exception ex) { ExportProgress.Value = 0; ExportStatus.Text = $"导出失败：{ex.Message}"; }
        finally { ExportButton.IsEnabled = Photos.Count > 0; }
    }

    private void SaveSettings() => SettingsStore.Save(new AppSettings(ReadRatio().ToString(), (int)GapSlider.Value, (int)RadiusSlider.Value,
        BackgroundBox.Text.Trim(), OutputFolderBox.Text.Trim(), ReadLongEdge(), ReadFormat()));

    private void SelectRatio(string ratio) => SelectByTag(RatioCombo, ratio);
    private static void SelectByTag(ComboBox combo, string tag)
    {
        foreach (ComboBoxItem item in combo.Items) if (string.Equals(item.Tag?.ToString(), tag, StringComparison.OrdinalIgnoreCase)) { combo.SelectedItem = item; return; }
        combo.SelectedIndex = 0;
    }
    private static void SelectByContent(ComboBox combo, string content)
    {
        foreach (ComboBoxItem item in combo.Items) if (string.Equals(item.Content?.ToString(), content, StringComparison.OrdinalIgnoreCase)) { combo.SelectedItem = item; return; }
        combo.SelectedIndex = 0;
    }
}
