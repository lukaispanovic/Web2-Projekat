using Common.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Interfaces
{
    public interface IUserDatabaseHandler
    {
        Task<User> GetUserByEmailAsync(string email);

        Task<User> GetUserByUsernameAsync(string username);

        Task<User> AddUserAsync(User user);
    }
}
