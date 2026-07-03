namespace ImageCollage.Core;

public static class TemplateCatalog
{
    private static NormalizedRect R(double x, double y, double w, double h) => new(x, y, w, h);

    private static readonly IReadOnlyDictionary<int, IReadOnlyList<CollageTemplate>> Templates =
        new Dictionary<int, IReadOnlyList<CollageTemplate>>
        {
            [1] = [T("one", "单图", R(0,0,1,1))],
            [2] = [
                T("two-v", "左右", R(0,0,.5,1), R(.5,0,.5,1)),
                T("two-h", "上下", R(0,0,1,.5), R(0,.5,1,.5)),
                T("two-main-left", "左侧主图", R(0,0,.64,1), R(.64,0,.36,1))
            ],
            [3] = [
                T("three-top", "上方主图", R(0,0,1,.62), R(0,.62,.5,.38), R(.5,.62,.5,.38)),
                T("three-left", "左侧主图", R(0,0,.62,1), R(.62,0,.38,.5), R(.62,.5,.38,.5)),
                T("three-h", "三行", R(0,0,1,1d/3), R(0,1d/3,1,1d/3), R(0,2d/3,1,1d/3)),
                T("three-v", "三列", R(0,0,1d/3,1), R(1d/3,0,1d/3,1), R(2d/3,0,1d/3,1))
            ],
            [4] = [
                T("four-grid", "2×2", R(0,0,.5,.5), R(.5,0,.5,.5), R(0,.5,.5,.5), R(.5,.5,.5,.5)),
                T("four-left-stack", "左侧分栏", R(0,0,.62,1), R(.62,0,.38,1d/3), R(.62,1d/3,.38,1d/3), R(.62,2d/3,.38,1d/3)),
                T("four-top-stack", "上方主图", R(0,0,1,.6), R(0,.6,1d/3,.4), R(1d/3,.6,1d/3,.4), R(2d/3,.6,1d/3,.4)),
                T("four-columns", "四列", R(0,0,.25,1), R(.25,0,.25,1), R(.5,0,.25,1), R(.75,0,.25,1))
            ],
            [5] = [
                T("five-feature", "自适应", R(0,0,.48,.5), R(.48,0,.52,.62), R(0,.5,.48,.22), R(0,.72,.48,.28), R(.48,.62,.52,.38)),
                T("five-left", "左侧主图", R(0,0,.58,1), R(.58,0,.42,.25), R(.58,.25,.42,.25), R(.58,.5,.42,.25), R(.58,.75,.42,.25)),
                T("five-top", "上方主图", R(0,0,1,.56), R(0,.56,.25,.44), R(.25,.56,.25,.44), R(.5,.56,.25,.44), R(.75,.56,.25,.44)),
                T("five-mosaic", "错落", R(0,0,.4,.5), R(.4,0,.6,.34), R(.4,.34,.3,.66), R(.7,.34,.3,.33), R(.7,.67,.3,.33))
            ],
            [6] = [
                T("six-grid", "2×3", R(0,0,.5,1d/3), R(.5,0,.5,1d/3), R(0,1d/3,.5,1d/3), R(.5,1d/3,.5,1d/3), R(0,2d/3,.5,1d/3), R(.5,2d/3,.5,1d/3)),
                T("six-feature", "主图拼接", R(0,0,.58,.66), R(.58,0,.42,1d/3), R(.58,1d/3,.42,1d/3), R(0,.66,1d/3,.34), R(1d/3,.66,1d/3,.34), R(2d/3,.66,1d/3,.34))
            ]
        };

    public static IReadOnlyList<CollageTemplate> ForCount(int count) =>
        Templates[Math.Clamp(count, 1, 6)];

    private static CollageTemplate T(string id, string name, params NormalizedRect[] cells) =>
        new(id, name, cells);
}
