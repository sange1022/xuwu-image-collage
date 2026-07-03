namespace ImageCollage.Core;

public static class RoundedCornerMask
{
    public static double OpacityAt(int x, int y, int width, int height, int radius)
    {
        if (radius <= 0) return 1;
        var centerLeft = radius - .5;
        var centerRight = width - radius - .5;
        var centerTop = radius - .5;
        var centerBottom = height - radius - .5;
        var dx = x < radius ? centerLeft - x : x >= width - radius ? x - centerRight : 0;
        var dy = y < radius ? centerTop - y : y >= height - radius ? y - centerBottom : 0;
        if (dx <= 0 || dy <= 0) return 1;
        var distance = Math.Sqrt(dx * dx + dy * dy);
        return Math.Clamp(radius + .5 - distance, 0, 1);
    }
}
