using Common;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ServiceControllers
{
    public class TokenService
    {
        private static ConfigurationReader configuration = new ConfigurationReader();

        public static string Token(int user_id, string role, string verified)
        {
            try
            {
                JwtSecurityTokenHandler tokenHandler = new();
                byte[] key = Encoding.ASCII.GetBytes(configuration.JwtKey);


                SecurityTokenDescriptor tokenDescriptor = new()
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new("id", user_id.ToString()),
                        new("user_role", role.ToString()),
                        new("verified", verified.ToString()),
                    }),
                    Expires = DateTime.UtcNow.AddMinutes(int.Parse(configuration.JwtExpirationTimeInMinutes)),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                    Issuer = configuration.JwtIssuer,
                    Audience = configuration.JwtAudience,
                };


                SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
                return tokenHandler.WriteToken(token);
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }

        public static string GetClaimValueFromToken(string? token, string claimName)
        {
            try
            {


                byte[] key = Encoding.ASCII.GetBytes(configuration.JwtKey);
                TokenValidationParameters validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = configuration.JwtIssuer,
                    ValidateAudience = true,
                    ValidAudience = configuration.JwtAudience,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                JwtSecurityTokenHandler tokenHandler = new();
                ClaimsPrincipal principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);

                Claim? claim = principal.FindFirst(claimName);
                return claim?.Value ?? string.Empty;
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }
    }
}
