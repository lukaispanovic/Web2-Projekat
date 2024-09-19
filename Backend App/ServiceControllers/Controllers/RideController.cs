using Common.DTOs;
using Common.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Communication.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;

namespace ServiceControllers.Controllers
{
    [Route("api/ride")]
    [ApiController]
    public class RideController : ControllerBase
    {
        private readonly IRideServiceStateless RidesServices = ServiceProxy.Create<IRideServiceStateless>(new Uri("fabric:/Backend_App/RideServiceStateless"));
        private readonly IUserServiceStateful UsersServices = ServiceProxy.Create<IUserServiceStateful>(new Uri("fabric:/Backend_App/UserServiceStateful"), new ServicePartitionKey(0), TargetReplicaSelector.PrimaryReplica);

        [HttpGet("all/{id?}")]
        public async Task<IActionResult> GetRides(int? id)
        {
            try
            {
                string jwt_role = TokenService.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "user_role");

                if (jwt_role == "Admin")
                {
                    return Ok(await RidesServices.GetRides(0, "Admin"));
                }
                else
                {
                    if (!int.TryParse(TokenService.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "id"), out int jwt_id) || jwt_id != id)
                        return Unauthorized("You don't have permission to view data!");

                    if (jwt_role == "User")
                        return Ok(await RidesServices.GetRides(jwt_id, "User"));
                    else if (jwt_role == "Driver")
                        return Ok(await RidesServices.GetRides(jwt_id, "Driver"));
                    else
                        return Unauthorized();
                }
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableRides()
        {
            try
            {
                string jwt_rola = TokenService.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "user_role");

                if (jwt_rola == "Driver")
                {
                    return Ok(await RidesServices.GetAvailableRides());
                }
                else
                    return Unauthorized();
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateRide(RideDataDTO data)
        {
            if (ModelState.IsValid == false)
                return BadRequest("Invalid data has been provided!");

            if (TokenService.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "user_role") != "User")
                return Unauthorized("You don't have permission to create a ride");

            try
            {
                var rideDat = await UsersServices.GetUserRideData(data.UserId);
                if (data.Id != 0)
                    return BadRequest("Already ordered ride");

                RideDataDTO ride = await RidesServices.CreateNewRide(data);

                if (ride.Id == 0)
                    return BadRequest();
                else
                {
                    if (await UsersServices.SetUserWaitOnRide(ride))
                        return Ok(ride);
                    else
                        return BadRequest();
                }
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [HttpPatch("accept/{ride_id}/{driver_id}")]
        public async Task<IActionResult> AcceptRide(int ride_id, int driver_id)
        {
            if (ride_id == 0 || driver_id == 0)
                return BadRequest();

            if (TokenService.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "user_role") != "Driver")
                return Unauthorized("You don't have permission to accept a ride");

            try
            {
                RideDataDTO ride = await RidesServices.AcceptExistingRide(ride_id, driver_id);

                if (ride.Id != 0)
                {
                    ride.Id = ride_id;
                    if (await UsersServices.SetDriverWaitOnRide(ride))
                        return Ok(ride);
                    else
                        return BadRequest("User can't be added into wait state.");
                }
                else
                    return BadRequest("Ride doesn't exist anymore.");
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [HttpGet("in-progress/{user_id}")]
        public async Task<IActionResult> IsUserAtRide(int user_id)
        {
            if (user_id == 0)
                return BadRequest("You didn't provide necessary data.");

            string jwt_role = TokenService.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "user_role");

            if (string.IsNullOrEmpty(jwt_role) || (jwt_role != "Driver" && jwt_role != "User"))
                return Unauthorized("You don't have permission to view data!");

            try
            {
                RideDataDTO data = await UsersServices.GetUserRideData(user_id);

                if (data.Id != 0)
                    return Ok(data);
                else
                    return BadRequest("User is not at wait state.");
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [HttpGet("in-progressDriver/{user_id}")]
        public async Task<IActionResult> IsDriverAtRide(int user_id)
        {
            if (user_id == 0)
                return BadRequest("You didn't provide necessary data.");

            string jwt_role = TokenService.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "user_role");

            if (string.IsNullOrEmpty(jwt_role) || (jwt_role != "Driver" && jwt_role != "User"))
                return Unauthorized("You don't have permission to view data!");

            try
            {
                RideDataDTO data = await UsersServices.GetUserRideData(user_id);

                if (data.Id != 0)
                    return Ok(data);
                else
                    return BadRequest("User is not at wait state.");
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [HttpPatch("finish/{ride_id}")]
        public async Task<IActionResult> FinishRide(int ride_id)
        {
            if (ride_id == 0)
                return BadRequest("Invalid ride ID.");

            try
            {
                RideDataDTO ride = await RidesServices.GetRideById(ride_id);

                if (ride.Id == 0)
                    return NotFound("Ride not found.");
                ride.RideStatus = StatusOfRide.Done;

                ride = await RidesServices.UpdateRide(ride);

                if (ride.Id != 0)
                    return Ok("Ride finished successfully.");
                else
                    return BadRequest("Failed to finish the ride.");
            }
            catch
            {
                return StatusCode(500, "An error occurred while finishing the ride.");
            }
        }

        [HttpPatch("review/{ride_id}/{review}")]
        public async Task<IActionResult> WriteReview(int ride_id, int review)
        {
            if (ride_id == 0 || review == 0 || (review < 1 && review > 5))
                return BadRequest();

            try
            {
                if (TokenService.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "user_role") != "User")
                    return Unauthorized("You don't have permission to view data!");

                RideDataDTO voznja = await RidesServices.GetRideById(ride_id);

                if (voznja.Id == 0)
                    return NotFound("Ride doesn't exist anymore.");

                if (!int.TryParse(TokenService.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "id"), out int jwt_id) || jwt_id != voznja.UserId)
                    return Unauthorized("You don't have permission to view data!");

                voznja.ReviewScore = review;

                voznja = await RidesServices.UpdateRide(voznja);

                if (voznja.Id != 0)
                    return Ok();
                else
                    return BadRequest();
            }
            catch
            {
                return StatusCode(500);
            }
        }
    }
}
