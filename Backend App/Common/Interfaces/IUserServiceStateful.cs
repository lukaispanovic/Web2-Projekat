using Common.DataModel;
using Common.DTOs;
using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Interfaces
{
    public interface IUserServiceStateful : IService
    {
        Task<UserDTO> LoginUser(UserLoginDTO dto);
        Task<UserDTO> RegisterUser(User dto);
        Task<UserDTO> EditUser(User dto);
        Task<UserDTO> GetUserById(int id);
        Task<UserDTO> GetUserData(string username);
        Task<IEnumerable<UserDTO>> GetDrivers();
        Task<UserDTO> VerifyUser(string username, bool isVerified);
    }
}
