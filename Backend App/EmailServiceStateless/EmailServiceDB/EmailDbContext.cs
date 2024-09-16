using Common.DataModel;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmailServiceStateless.EmailServiceDB
{
    public class EmailDbContext : DbContext
    {
        public DbSet<Email> Emails { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=C:\\Databases\\EmailDB.db");
        }
    }
}
