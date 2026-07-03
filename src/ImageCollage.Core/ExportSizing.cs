namespace ImageCollage.Core;

public static class ExportSizing
{
    public static PixelSize FromLongEdge(CanvasRatio ratio, int longEdge)
    {
        if (longEdge < 64) throw new ArgumentOutOfRangeException(nameof(longEdge));
        return ratio.Width >= ratio.Height
            ? new PixelSize(longEdge, (int)Math.Round(longEdge / ratio.Value))
            : new PixelSize((int)Math.Round(longEdge * ratio.Value), longEdge);
    }
}
