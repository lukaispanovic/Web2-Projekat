using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class ConfigurationReader
    {
        private readonly IConfiguration _configuration;

        public ConfigurationReader()
        {
            _configuration = new ConfigurationBuilder().SetBasePath(AppContext.BaseDirectory).AddJsonFile("appsettings.json", optional: false, reloadOnChange: true).Build();
        }

        public string JwtIssuer => _configuration["Jwt:Issuer"];
        public string JwtAudience => _configuration["Jwt:Audience"];
        public string JwtKey => _configuration["Jwt:Key"];
        public string JwtExpirationTimeInMinutes => _configuration["Jwt:ExpirationTimeInMinutes"];

        public string UsersSqlConnection => _configuration["ConnectionStrings:UsersSqlConnection"];
        public string RidesSqlConnection => _configuration["ConnectionStrings:RidesSqlConnection"];

        public string FileStoragePath => _configuration["FileStorage:Path"];

        public string LoggingDefaultLogLevel => _configuration["Logging:LogLevel:Default"];
        public string LoggingMicrosoftAspNetCoreLogLevel => _configuration["Logging:LogLevel:Microsoft.AspNetCore"];

        public string AllowedHosts => _configuration["AllowedHosts"];
    }
}
