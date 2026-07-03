using ImageCollage.Core;

namespace ImageCollage.Core.Tests;

public sealed class LayoutTests
{
    [Theory]
    [InlineData("1:1", 1d)]
    [InlineData("3:4", 0.75d)]
    [InlineData("16:9", 16d / 9d)]
    public void RatiosParseToExpectedValue(string text, double expected)
    {
        Assert.Equal(expected, CanvasRatio.Parse(text).Value, 6);
    }

    [Fact]
    public void CatalogOffersLayoutsMatchingPhotoCount()
    {
        var templates = TemplateCatalog.ForCount(4);
        Assert.NotEmpty(templates);
        Assert.All(templates, template => Assert.Equal(4, template.Cells.Count));
    }

    [Fact]
    public void PixelLayoutStaysInsideCanvasAndAppliesGap()
    {
        var template = TemplateCatalog.ForCount(4).First();
        var cells = LayoutCalculator.ToPixels(template, 1200, 1600, 20);
        Assert.Equal(4, cells.Count);
        Assert.All(cells, cell =>
        {
            Assert.True(cell.X >= 0 && cell.Y >= 0);
            Assert.True(cell.Right <= 1200 && cell.Bottom <= 1600);
            Assert.True(cell.Width > 0 && cell.Height > 0);
        });
        Assert.True(cells[0].Right < cells[1].X || cells[0].Bottom < cells[1].Y);
    }

    [Theory]
    [InlineData(3, 4, 1600, 1200)]
    [InlineData(16, 9, 1600, 900)]
    public void ExportSizePreservesRatio(int rw, int rh, int longEdge, int expectedOther)
    {
        var result = ExportSizing.FromLongEdge(new CanvasRatio(rw, rh), longEdge);
        Assert.Contains(expectedOther, new[] { result.Width, result.Height });
        Assert.Contains(longEdge, new[] { result.Width, result.Height });
    }
}
