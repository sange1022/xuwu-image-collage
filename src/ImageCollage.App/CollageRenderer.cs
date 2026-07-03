using System.IO;
using System.Windows.Media.Imaging;
using ImageCollage.Core;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace ImageCollage.App;

public static class CollageRenderer
{
    public static async Task<PhotoItem> LoadAsync(string path) => await Task.Run(() =>
    {
        using var image = Image.Load<Rgba32>(path);
        image.Mutate(x => x.AutoOrient());
        using var thumb = image.Clone(x => x.Resize(new ResizeOptions { Mode = ResizeMode.Crop, Size = new Size(96, 96) }));
        using var stream = new MemoryStream();
        thumb.SaveAsPng(stream);
        return new PhotoItem { Path = path, PixelWidth = image.Width, PixelHeight = image.Height, Thumbnail = ToBitmap(stream) };
    });

    public static async Task<BitmapImage> PreviewAsync(IReadOnlyList<PhotoItem> photos, CollageTemplate template,
        CanvasRatio ratio, int gap, int radius, Rgba32 background, CancellationToken token) => await Task.Run(() =>
    {
        token.ThrowIfCancellationRequested();
        var size = ExportSizing.FromLongEdge(ratio, 1100);
        using var collage = Render(photos, template, size.Width, size.Height, gap, radius, background, token);
        using var stream = new MemoryStream();
        collage.SaveAsPng(stream);
        return ToBitmap(stream);
    }, token);

    public static async Task ExportAsync(IReadOnlyList<PhotoItem> photos, CollageTemplate template,
        int width, int height, int gap, int radius, Rgba32 background, string path, string format,
        CancellationToken token) => await Task.Run(() =>
    {
        using var collage = Render(photos, template, width, height, gap, radius, background, token);
        Directory.CreateDirectory(Path.GetDirectoryName(path)!);
        switch (format.ToLowerInvariant())
        {
            case "png": collage.Save(path, new PngEncoder()); break;
            case "webp": collage.Save(path, new WebpEncoder { Quality = 94 }); break;
            default: collage.Save(path, new JpegEncoder { Quality = 94 }); break;
        }
    }, token);

    private static Image<Rgba32> Render(IReadOnlyList<PhotoItem> photos, CollageTemplate template,
        int width, int height, int gap, int radius, Rgba32 background, CancellationToken token)
    {
        var canvas = new Image<Rgba32>(width, height, background);
        var cells = LayoutCalculator.ToPixels(template, width, height, gap);
        for (var i = 0; i < Math.Min(Math.Min(photos.Count, cells.Count), 6); i++)
        {
            token.ThrowIfCancellationRequested();
            var cell = cells[i];
            using var source = Image.Load<Rgba32>(photos[i].Path);
            source.Mutate(x => x.AutoOrient().Resize(new ResizeOptions
            {
                Mode = ResizeMode.Crop,
                Position = AnchorPositionMode.Center,
                Size = new Size(cell.Width, cell.Height),
                Sampler = KnownResamplers.Lanczos3
            }));
            ApplyRoundedCorners(source, Math.Min(radius, Math.Min(cell.Width, cell.Height) / 2));
            canvas.Mutate(x => x.DrawImage(source, new Point(cell.X, cell.Y), 1f));
        }
        return canvas;
    }

    private static void ApplyRoundedCorners(Image<Rgba32> image, int radius)
    {
        if (radius <= 0) return;
        image.ProcessPixelRows(accessor =>
        {
            for (var y = 0; y < image.Height; y++)
            {
                var row = accessor.GetRowSpan(y);
                for (var x = 0; x < image.Width; x++)
                {
                    var cx = x < radius ? radius - x : x >= image.Width - radius ? x - (image.Width - radius - 1) : 0;
                    var cy = y < radius ? radius - y : y >= image.Height - radius ? y - (image.Height - radius - 1) : 0;
                    if (cx > 0 && cy > 0 && cx * cx + cy * cy > radius * radius) row[x].A = 0;
                }
            }
        });
    }

    private static BitmapImage ToBitmap(MemoryStream stream)
    {
        stream.Position = 0;
        var bitmap = new BitmapImage();
        bitmap.BeginInit(); bitmap.CacheOption = BitmapCacheOption.OnLoad; bitmap.StreamSource = stream; bitmap.EndInit();
        bitmap.Freeze();
        return bitmap;
    }
}
