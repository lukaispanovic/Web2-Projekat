using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Common.DataModel;
using Common.DTOs;
using Common.Interfaces;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Communication.Client;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Microsoft.ServiceFabric.Services.Runtime;
using RideServiceStateless.RideServiceDatabase;

namespace RideServiceStateless
{
    /// <summary>
    /// An instance of this class is created for each service instance by the Service Fabric runtime.
    /// </summary>
    internal sealed class RideServiceStateless : StatelessService, IRideServiceStateless
    {
        private readonly IMapper _mapper;
        private readonly IUserServiceStateful _usersServices = ServiceProxy.Create<IUserServiceStateful>(new Uri("fabric:/Backend_App/UserServiceStateful"), new ServicePartitionKey(0), TargetReplicaSelector.PrimaryReplica);

        public RideServiceStateless(StatelessServiceContext context, IMapper mapper)
            : base(context)
        { _mapper = mapper; }

        public async Task<RideDataDTO> GetRideById(int id)
        {
            if (id <= 0) return new RideDataDTO { Id = 0 };

            try
            {
                var ride = await new RideRepository().GetRideByIdAsync(id);
                return _mapper.Map<RideDataDTO>(ride);
            }
            catch
            {
                return new RideDataDTO { Id = 0 };
            }
        }

        public async Task<float> GetDriverMetaScore(int driverId)
        {
            if (driverId <= 0) return 0.0f;

            try
            {
                var rides = await new RideRepository().FilterRidesAsync(r => r.DriverId == driverId && r.RideStatus == StatusOfRide.Done && r.ReviewScore > 0);
                if (rides.Count == 0) return 0.0f;

                var averageScore = rides.Average(r => r.ReviewScore);
                return (float)Math.Round(averageScore, 2);
            }
            catch
            {
                return 0.0f;
            }
        }


        public async Task<RideDataDTO> CreateNewRide(RideDataDTO data)
        {
            try
            {
                var ride = _mapper.Map<Ride>(data);
                ride.RideStatus = StatusOfRide.Created;

                var createdRide = await new RideRepository().AddRideAsync(ride);
                return createdRide.Id != 0 ? _mapper.Map<RideDataDTO>(createdRide) : new RideDataDTO { Id = 0 };
            }
            catch
            {
                return new RideDataDTO { Id = 0 };
            }
        }

        public async Task<RideDataDTO> UpdateRide(RideDataDTO data)
        {
            try
            {
                if (data.Id == 0) return new RideDataDTO { Id = 0 };

                var ridesRepository = new RideRepository();
                var existingRide = await ridesRepository.GetRideByIdAsync(data.Id);
                if (existingRide.Id == 0) return new RideDataDTO { Id = 0 };

                if (data.DriverId == data.UserId)
                {
                    data.DriverId = existingRide.DriverId;
                    data.UserId = existingRide.UserId;
                }

                if (data.WaitingTime == 0) data.WaitingTime = existingRide.WaitingTime;
                if (data.TravelTime == 0) data.TravelTime = existingRide.TravelTime;

                var updatedRide = await ridesRepository.UpdateRideAsync(_mapper.Map<Ride>(data));
                return updatedRide.Id != 0 ? _mapper.Map<RideDataDTO>(updatedRide) : new RideDataDTO { Id = 0 };
            }
            catch
            {
                return new RideDataDTO { Id = 0 };
            }
        }

        public async Task<List<RideDataDTO>> GetRides(int userId, string role)
        {
            try
            {
                var ridesRepository = new RideRepository();

                List<Ride> rides = role switch
                {
                    "Admin" => await ridesRepository.GetAllRidesAsync(),
                    "User" => await ridesRepository.FilterRidesAsync(r => r.UserId == userId),
                    "Driver" => await ridesRepository.FilterRidesAsync(r => r.DriverId == userId && r.RideStatus == StatusOfRide.Done),
                    _ => new List<Ride>()
                };

                return _mapper.Map<List<RideDataDTO>>(rides);
            }
            catch
            {
                return new List<RideDataDTO>();
            }
        }

        public async Task<List<RideDataDTO>> GetAvailableRides()
        {
            try
            {
                var rides = await new RideRepository().FilterRidesAsync(r => r.RideStatus == StatusOfRide.Created);
                return _mapper.Map<List<RideDataDTO>>(rides);
            }
            catch
            {
                return new List<RideDataDTO>();
            }
        }

        public async Task<RideDataDTO> AcceptExistingRide(int rideId, int driverId)
        {
            try
            {
                if (rideId == 0 || driverId == 0) return new RideDataDTO { Id = 0 };

                var ridesRepository = new RideRepository();
                var ride = await ridesRepository.GetRideByIdAsync(rideId);
                if (ride.Id == 0) return new RideDataDTO { Id = 0 };

                var driver = await _usersServices.GetUserById(driverId);
                if (driver.Id == 0)
                    return new RideDataDTO { Id = 0 };

                ride.RideStatus = StatusOfRide.InProgress;
                ride.DriverId = driverId;
                ride.TravelTime = new Random().Next(10, 60);

                var updatedRide = await ridesRepository.UpdateRideAsync(ride);
                return updatedRide.Id != 0 ? _mapper.Map<RideDataDTO>(updatedRide) : new RideDataDTO { Id = 0 };
            }
            catch
            {
                return new RideDataDTO { Id = 0 };
            }
        }

        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return new ServiceInstanceListener[0];
        }

        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            while (true)
            {
                cancellationToken.ThrowIfCancellationRequested();
                await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
            }
        }
    }
}
