using Common.DataModel;
using Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserServiceStateful.UserServiceDatabase
{
    public class UserRepository : IUserDatabaseHandler
    {
        static UserRepository()
        {
            using (var context = new UserDbContext())
            {
                context.Database.EnsureCreated();
            }
        }
        public async Task<User> GetUserByEmailAsync(string email)
        {
            using (var _context = new UserDbContext())
            {
                return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            }
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            using (var _context = new UserDbContext())
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
                return user;
            }
        }
    }
}
