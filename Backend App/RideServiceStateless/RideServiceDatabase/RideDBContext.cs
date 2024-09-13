using Common.DataModel;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RideServiceStateless.RideServiceDatabase
{
    public class RideDBContext : DbContext
    {
        public DbSet<Ride> Rides { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=C:\\Databases\\RideDB.db");
        }
    }
}
