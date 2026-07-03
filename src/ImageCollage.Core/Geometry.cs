namespace ImageCollage.Core;

public readonly record struct NormalizedRect(double X, double Y, double Width, double Height);

public readonly record struct PixelRect(int X, int Y, int Width, int Height)
{
    public int Right => X + Width;
    public int Bottom => Y + Height;
}

public sealed record CollageTemplate(string Id, string Name, IReadOnlyList<NormalizedRect> Cells);

public readonly record struct PixelSize(int Width, int Height);
