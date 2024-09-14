using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Common.DTOs;
using Common.Interfaces;
using Common;
using Microsoft.ServiceFabric.Data.Collections;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using UserServiceStateful.UserServiceDatabase;
using Common.DataModel;

namespace UserServiceStateful
{
    /// <summary>
    /// An instance of this class is created for each service replica by the Service Fabric runtime.
    /// </summary>
    internal sealed class UserServiceStateful : StatefulService, IUserServiceStateful
    {

        private readonly IMapper _mapper;
        private readonly IUserDatabaseHandler _repository;
        private readonly IFileStorageService _fileStorageService;

        public UserServiceStateful(StatefulServiceContext context, IMapper mapper)  : base(context)
        { 
            _mapper = mapper;
            _repository = new UserRepository();
            _fileStorageService = new FileStorageService("C:\\Databases\\ProfileImages");
        }

        protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners() => this.CreateServiceRemotingReplicaListeners();

        public async Task<UserDTO> LoginUser(UserLoginDTO dto)
        {
            var user = await _repository.GetUserByUsernameAsync(dto.Username);
            if (user == null)
            {
                return new UserDTO();
            }
            if(user.Password != dto.Password)
            {
                UserDTO userFail = new();
                userFail.Id = -1;
                return userFail;
            }
            return _mapper.Map<UserDTO>(user);
        }

        public async Task<UserDTO> RegisterUser(User user)
        {
            var userExists = await _repository.GetUserByEmailAsync(user.Email);
            if( userExists != null)
            {
                return new UserDTO();
            }
            var usernameTaken = await _repository.GetUserByUsernameAsync(user.Username);
            if (usernameTaken != null)
            {
                UserDTO userFail = new();
                userFail.Id = -1;
                return userFail;
            }

            if (user.UserType == "Driver")
                user.Verified = false;
            else
                user.Verified = true;
            user.RideDataId = -1;
            await _repository.AddUserAsync(user);
            return _mapper.Map<UserDTO>(user);
        }
    }
}
