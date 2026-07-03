namespace ImageCollage.Core;

public readonly record struct CanvasRatio
{
    public int Width { get; }
    public int Height { get; }
    public double Value => (double)Width / Height;

    public CanvasRatio(int width, int height)
    {
        if (width <= 0 || height <= 0) throw new ArgumentOutOfRangeException(nameof(width));
        Width = width;
        Height = height;
    }

    public static CanvasRatio Parse(string text)
    {
        var parts = text.Split(':');
        if (parts.Length != 2 || !int.TryParse(parts[0], out var width) || !int.TryParse(parts[1], out var height))
            throw new FormatException("比例格式应为 宽:高。");
        return new CanvasRatio(width, height);
    }

    public override string ToString() => $"{Width}:{Height}";
}
