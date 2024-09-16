using AutoMapper;
using Common.DataModel;
using Common.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RideServiceStateless.RideServiceDatabase
{
    public class Mapping : Profile
    {
        public Mapping() 
        {
            CreateMap<Ride, RideDataDTO>();
            CreateMap<RideDataDTO, Ride>();
        }
    }
}
