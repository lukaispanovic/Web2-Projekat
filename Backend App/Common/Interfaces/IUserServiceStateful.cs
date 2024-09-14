﻿using Common.DataModel;
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
    }
}
