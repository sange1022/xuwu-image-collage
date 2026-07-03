namespace ImageCollage.Core;

public static class FocusCropCalculator
{
    public static PixelRect Calculate(int sourceWidth, int sourceHeight, int targetWidth, int targetHeight,
        double imageOffsetX, double imageOffsetY)
    {
        if (sourceWidth <= 0 || sourceHeight <= 0 || targetWidth <= 0 || targetHeight <= 0)
            throw new ArgumentOutOfRangeException(nameof(sourceWidth));

        var targetRatio = (double)targetWidth / targetHeight;
        var sourceRatio = (double)sourceWidth / sourceHeight;
        var cropWidth = sourceWidth;
        var cropHeight = sourceHeight;
        if (sourceRatio > targetRatio) cropWidth = Math.Max(1, (int)Math.Round(sourceHeight * targetRatio));
        else if (sourceRatio < targetRatio) cropHeight = Math.Max(1, (int)Math.Round(sourceWidth / targetRatio));

        imageOffsetX = Math.Clamp(imageOffsetX, -1, 1);
        imageOffsetY = Math.Clamp(imageOffsetY, -1, 1);
        var availableX = sourceWidth - cropWidth;
        var availableY = sourceHeight - cropHeight;
        var x = (int)Math.Round(availableX * (1 - imageOffsetX) / 2d);
        var y = (int)Math.Round(availableY * (1 - imageOffsetY) / 2d);
        return new PixelRect(x, y, cropWidth, cropHeight);
    }
}
