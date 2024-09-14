using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Common.DTOs;
using Common.Interfaces;
using Microsoft.ServiceFabric.Data.Collections;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using UserServiceStateful.UserServiceDatabase;

namespace UserServiceStateful
{
    /// <summary>
    /// An instance of this class is created for each service replica by the Service Fabric runtime.
    /// </summary>
    internal sealed class UserServiceStateful : StatefulService, IUserServiceStateful
    {

        private readonly IMapper _mapper;
        private readonly IUserDatabaseHandler _repository;


        public UserServiceStateful(StatefulServiceContext context, IMapper mapper)  : base(context)
        { 
            _mapper = mapper;
            _repository = new UserRepository();
        }

        /// <summary>
        /// Optional override to create listeners (e.g., HTTP, Service Remoting, WCF, etc.) for this service replica to handle client or user requests.
        /// </summary>
        /// <remarks>
        /// For more information on service communication, see https://aka.ms/servicefabricservicecommunication
        /// </remarks>
        /// <returns>A collection of listeners.</returns>
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
    }
}
