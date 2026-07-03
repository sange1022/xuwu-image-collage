using ImageCollage.Core;

namespace ImageCollage.Core.Tests;

public sealed class FocusCropCalculatorTests
{
    [Fact]
    public void CenteredWideImageCropsEquallyFromBothSides()
    {
        var crop = FocusCropCalculator.Calculate(2000, 1000, 1000, 1000, 0, 0);
        Assert.Equal(new PixelRect(500, 0, 1000, 1000), crop);
    }

    [Fact]
    public void MovingImageLeftRevealsItsRightSide()
    {
        var crop = FocusCropCalculator.Calculate(2000, 1000, 1000, 1000, -1, 0);
        Assert.Equal(new PixelRect(1000, 0, 1000, 1000), crop);
    }

    [Fact]
    public void MovingImageDownRevealsItsTopSide()
    {
        var crop = FocusCropCalculator.Calculate(1000, 2000, 1000, 1000, 0, 1);
        Assert.Equal(new PixelRect(0, 0, 1000, 1000), crop);
    }

    [Fact]
    public void OffsetIsClampedToValidRange()
    {
        var crop = FocusCropCalculator.Calculate(2000, 1000, 1000, 1000, 4, 0);
        Assert.Equal(0, crop.X);
        Assert.Equal(1000, crop.Width);
    }
}
