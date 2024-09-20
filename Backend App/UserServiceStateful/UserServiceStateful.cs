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
using Microsoft.ServiceFabric.Services.Remoting.Client;
using BCrypt.Net;

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

        private readonly IRideServiceStateless _ridesServices = ServiceProxy.Create<IRideServiceStateless>(new Uri("fabric:/Backend_App/RideServiceStateless"));

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

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
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
            if (userExists != null)
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

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);
            user.Password = hashedPassword;

            if (user.UserType == "Driver")
                user.Verified = false;
            else
                user.Verified = true;

            user.RideDataId = -1;
            user.Blocked = false;
            await _repository.AddUserAsync(user);
            return _mapper.Map<UserDTO>(user);
        }

        public async Task<UserDTO> EditUser(User user)
        {
            User old = await _repository.GetUserByEmailAsync(user.Email);
            user.Password = old.Password;
            user.Id = old.Id;
            await _repository.UpdateUserAsync(user);
            return _mapper.Map<UserDTO>(user);
        }

        public async Task<UserDTO> GetUserById(int id)
        {
            if (id <= 0)
                return new();
            try
            {
                User user = await _repository.GetUserByIdAsync(id);
                if (user.Id != 0)
                {
                    string slika = await _fileStorageService.GetFileStringAsync(user.ProfilePictureUrl);
                    if (slika == string.Empty)
                        return new();

                    user.ProfilePictureUrl = slika;
                    return _mapper.Map<User, UserDTO>(user);
                }
                else
                    return new();
            }
            catch
            {
                return new();
            }
        }

        public async Task<UserDTO> GetUserData(string username)
        {
            var user = await _repository.GetUserByEmailAsync(username);
            return _mapper.Map<UserDTO>(user);
        }

        public async Task<IEnumerable<UserDTO>> GetDrivers()
        {
            var users = await _repository.FilterUsersAsync(u => u.UserType == "Driver");
            return _mapper.Map<IEnumerable<UserDTO>>(users);
        }

        public async Task<UserDTO> VerifyUser(string username, bool isVerified)
        {
            var user = await _repository.GetUserByUsernameAsync(username);
            user.Verified = isVerified;
            await _repository.UpdateUserAsync(user);
            return _mapper.Map<UserDTO>(user);
        }

        public async Task<UserDTO> BlockUser(string username, bool isBlocked)
        {
            var user = await _repository.GetUserByUsernameAsync(username);
            user.Blocked = isBlocked;
            await _repository.UpdateUserAsync(user);
            return _mapper.Map<UserDTO>(user);
        }

        public async Task<RideDataDTO> GetUserRideData(int userId)
        {
            var user = await _repository.GetUserByIdAsync(userId);
            if (user == null || user.RideDataId == null)
            {
                return new RideDataDTO();
            }
            var data = await _ridesServices.GetRideById(user.RideDataId.Value);
            if (data == null)
                return new RideDataDTO();
            return data;
        }

        public async Task<bool> SetUserWaitOnRide(RideDataDTO data)
        {
            var user = await _repository.GetUserByIdAsync(data.UserId);
            if (user != null)
            {
                user.RideDataId = data.Id;
                await _repository.UpdateUserAsync(user);
                return true;
            }
            return false;
        }

        public async Task<bool> SetDriverWaitOnRide(RideDataDTO data)
        {
            var user = await _repository.GetUserByIdAsync(data.DriverId);
            if (user != null)
            {
                user.RideDataId = data.Id;
                await _repository.UpdateUserAsync(user);
                return true;
            }
            return false;
        }
    }
}
