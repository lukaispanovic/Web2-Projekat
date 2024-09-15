using AutoMapper;
using Common.DataModel;
using Common.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserServiceStateful.UserServiceDatabase
{
    public class Mapping : Profile
    {
        public Mapping() 
        {
            CreateMap<UserLoginDTO, User>();
            CreateMap<UserRegisterDTO, User>();
            CreateMap<UserEditDTO, User>();
            CreateMap<User, UserDTO>();
        }
    }
}
