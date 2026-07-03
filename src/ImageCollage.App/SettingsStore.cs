using System.IO;
using System.Text.Json;

namespace ImageCollage.App;

public sealed record AppSettings(string Ratio, int Gap, int Radius, string Background, string OutputFolder, int LongEdge, string Format)
{
    public static AppSettings Default => new("3:4", 12, 8, "#FFFFFF", Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyPictures), "戌無拼图导出"), 2400, "PNG");
}

public static class SettingsStore
{
    private static string FilePath => Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "XuwuImageCollage", "settings.json");
    public static AppSettings Load()
    {
        try { return JsonSerializer.Deserialize<AppSettings>(File.ReadAllText(FilePath)) ?? AppSettings.Default; }
        catch { return AppSettings.Default; }
    }
    public static void Save(AppSettings settings)
    {
        Directory.CreateDirectory(Path.GetDirectoryName(FilePath)!);
        File.WriteAllText(FilePath, JsonSerializer.Serialize(settings));
    }
}
