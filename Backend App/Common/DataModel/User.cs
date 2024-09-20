using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Common.DataModel
{
    [DataContract]
    public class User
    {
        [DataMember]
        public long Id { get; set; }

        [DataMember]
        public string Username { get; set; }

        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public string Surname { get; set; }

        [DataMember]
        public string Password { get; set; }

        [DataMember]
        public string Address { get; set; }

        [DataMember]
        public DateTime Birthday { get; set; }

        [DataMember]
        public string UserType { get; set; }

        [DataMember]
        public string Email { get; set; }

        [DataMember]
        public string ProfilePictureUrl { get; set; }

        [DataMember(IsRequired = false)]
        public int? RideDataId { get; set; }

        [DataMember]
        public bool? Verified { get; set; }
        [DataMember]
        public bool? Blocked { get; set; }
    }
}
