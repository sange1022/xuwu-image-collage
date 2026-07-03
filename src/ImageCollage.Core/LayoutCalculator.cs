namespace ImageCollage.Core;

public static class LayoutCalculator
{
    public static IReadOnlyList<PixelRect> ToPixels(CollageTemplate template, int width, int height, int gap)
    {
        if (width <= 0 || height <= 0) throw new ArgumentOutOfRangeException(nameof(width));
        gap = Math.Clamp(gap, 0, Math.Min(width, height) / 4);
        var half = gap / 2d;
        return template.Cells.Select(cell =>
        {
            var leftInset = cell.X <= 0 ? gap : half;
            var topInset = cell.Y <= 0 ? gap : half;
            var rightInset = cell.X + cell.Width >= .999999 ? gap : half;
            var bottomInset = cell.Y + cell.Height >= .999999 ? gap : half;
            var x = (int)Math.Round(cell.X * width + leftInset);
            var y = (int)Math.Round(cell.Y * height + topInset);
            var right = (int)Math.Round((cell.X + cell.Width) * width - rightInset);
            var bottom = (int)Math.Round((cell.Y + cell.Height) * height - bottomInset);
            return new PixelRect(x, y, Math.Max(1, right - x), Math.Max(1, bottom - y));
        }).ToArray();
    }
}
