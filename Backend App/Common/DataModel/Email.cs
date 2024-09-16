using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Common.DataModel
{
    public class Email
    {
        [DataMember]
        public int Id { get; set; }

        [DataMember]
        public string Receipent { get; set; } = string.Empty;

        [DataMember]
        public string Message { get; set; } = string.Empty;

        [DataMember]
        public bool Sent { get; set; } = false;
    }
}
