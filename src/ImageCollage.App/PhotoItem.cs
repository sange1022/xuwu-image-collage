using System.IO;
using System.Windows.Media.Imaging;

namespace ImageCollage.App;

public sealed class PhotoItem
{
    public required string Path { get; init; }
    public required BitmapImage Thumbnail { get; init; }
    public required int PixelWidth { get; init; }
    public required int PixelHeight { get; init; }
    public string FileName => System.IO.Path.GetFileName(Path);
    public string Dimensions => $"{PixelWidth} × {PixelHeight}";
    public double OffsetX { get; set; }
    public double OffsetY { get; set; }
}
