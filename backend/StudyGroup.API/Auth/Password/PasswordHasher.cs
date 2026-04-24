 namespace StudyGroup.API.Auth.Password;

public class PasswordHasher : IPasswordHasher
{
    private readonly string _pepper;


    public PasswordHasher(IConfiguration config)
    {
        // Read pepper from configuration
        _pepper = config["PasswordOptions:Pepper"] ?? "DefaultPepper2026";
    }

    /// Hash password with salt (BCrypt) and pepper (our secret).
    /// 
    /// SALT: BCrypt generates random salt automatically. Different for each password.
    /// PEPPER: Our secret from appsettings .
    public string Hash(string password)
    {
        var passwordWithPepper = password + _pepper;
        
        // BCrypt handles salt automatically and uses workFactor 12
        return BCrypt.Net.BCrypt.HashPassword(passwordWithPepper, workFactor: 12);
    }


    public bool Verify(string password, string hash)
    {
        // Add same pepper to verify
        var passwordWithPepper = password + _pepper;
        
        // BCrypt extracts salt from hash and compares
        return BCrypt.Net.BCrypt.Verify(passwordWithPepper, hash);
    }
}