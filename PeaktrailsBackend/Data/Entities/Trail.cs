public class Trail
{
    public int TrailId { get; set; }
    public string Name { get; set; }
    public decimal Length { get; set; }
    public DateTime CreatedDate { get; set; }
    public string? Difficulty { get; set; }
    public string Description { get; set; }
    public decimal? Elevation { get; set; }
    public decimal? TotalAscent { get; set; }
    public decimal? TotalDescent { get; set; }
    public string Location { get; set; }
    public string GPXLocation { get; set; }
    public string GPXContent { get; set; }
}
