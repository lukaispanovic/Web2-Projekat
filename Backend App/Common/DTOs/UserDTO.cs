using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTOs
{
    public class UserDTO
    {
        public string Username { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Address { get; set; }
        public DateTime Birthday { get; set; }
        public string UserType { get; set; }
        public string Email { get; set; }
        public string ProfilePictureUrl { get; set; }
        public long Id { get; set; }

        public bool? Verified { get; set; }
        public bool? Blocked { get; set; }

        public UserDTO() => Id = 0;
    }
}
