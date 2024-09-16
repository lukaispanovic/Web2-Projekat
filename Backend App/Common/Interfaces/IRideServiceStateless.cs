using Common.DTOs;
using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Interfaces
{
    public interface IRideServiceStateless : IService
    {
        Task<RideDataDTO> GetRideById(int id);

        Task<float> GetDriverMetaScore(int driver_id);
        Task<RideDataDTO> CreateNewRide(RideDataDTO data);
        Task<RideDataDTO> UpdateRide(RideDataDTO data);

        Task<RideDataDTO> AcceptExistingRide(int ride_id, int driver_id);

        Task<List<RideDataDTO>> GetRides(int id, string role);

        Task<List<RideDataDTO>> GetAvailableRides();
    }
}
