using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Common.DataModel
{
    public class Ride
    {
        [DataMember]
        public int Id { get; set; }

        [DataMember]
        public int UserId { get; set; }

        public int? DriverId { get; set; }

        [DataMember]
        public string StartAddress { get; set; } = string.Empty;

        [DataMember]
        public string EndAddress { get; set; } = string.Empty;

        [DataMember]
        public float Price { get; set; }

        [DataMember]
        public int WaitingTime { get; set; }

        [DataMember]
        public int? TravelTime { get; set; }

        [DataMember]
        public bool RideStatus { get; set; }

        [DataMember]
        public int ReviewScore { get; set; }
    }
}
