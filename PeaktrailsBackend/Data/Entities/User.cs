namespace PeaktrailsApp.Data.Entities
{
    public class User
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }

        // Navigatie-eigenschap voor favoriete trails
        public ICollection<FavoriteTrail> FavoriteTrails { get; set; }
    }
}
