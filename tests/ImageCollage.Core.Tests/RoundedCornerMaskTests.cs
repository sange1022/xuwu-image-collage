using ImageCollage.Core;

namespace ImageCollage.Core.Tests;

public sealed class RoundedCornerMaskTests
{
    [Fact]
    public void CornerPixelIsTransparent()
    {
        Assert.Equal(0, RoundedCornerMask.OpacityAt(0, 0, 100, 100, 10));
    }

    [Fact]
    public void AntiAliasedBoundaryHasPartialOpacity()
    {
        var opacity = RoundedCornerMask.OpacityAt(1, 4, 100, 100, 10);
        Assert.InRange(opacity, .01, .99);
    }

    [Fact]
    public void InteriorPixelIsOpaque()
    {
        Assert.Equal(1, RoundedCornerMask.OpacityAt(50, 50, 100, 100, 10));
    }
}
