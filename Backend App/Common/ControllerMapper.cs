using Common.DataModel;
using Common.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public static class ControllerMapper
    {
        public static User ToUser(this UserRegisterDTO dto, string profilePictureUrl)
        {
            return new User
            {
                Username = dto.Username,
                Name = dto.Name,
                Surname = dto.Surname,
                Password = dto.Password,
                Address = dto.Address,
                Birthday = dto.Birthday,
                UserType = dto.UserType,
                Email = dto.Email,
                ProfilePictureUrl = profilePictureUrl,
                Verified = false,
                Blocked = false
            };
        }

        public static User EditToUser(this UserEditDTO dto, string profilePictureUrl)
        {
            return new User
            {
                Username = dto.Username,
                Name = dto.Name,
                Surname = dto.Surname,
                Password = "",
                Address = dto.Address,
                Birthday = dto.Birthday,
                UserType = dto.UserType,
                Email = dto.Email,
                ProfilePictureUrl = profilePictureUrl,
                Verified = true,
                Blocked = false
            };
        }
    }
}
