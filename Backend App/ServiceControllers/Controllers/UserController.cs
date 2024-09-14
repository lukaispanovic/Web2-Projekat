using Common.DTOs;
using Common.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Communication.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;

namespace ServiceControllers.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserServiceStateful _userService = ServiceProxy.Create<IUserServiceStateful>(new Uri("fabric:/Backend_App/UserServiceStateful"), new ServicePartitionKey(0), TargetReplicaSelector.PrimaryReplica);

        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromForm] UserLoginDTO dto)
        {
            try
            {
                var userDto = await _userService.LoginUser(dto);

                if (userDto.Id == -1)
                {
                    return Unauthorized("Wrong password!");
                }

                if (userDto == null || userDto.Id == 0)
                    return NotFound("User doesn't exist!");

                string isVerified = "false";
                if (userDto.Verified != null)
                    isVerified = userDto.Verified.ToString();

                string token = TokenService.Token((int)userDto.Id, userDto.UserType, isVerified);
                if (token == string.Empty)
                    return BadRequest("Something went wrong");
                else
                    return Ok(new LoginResponseDTO() { Token = token, User = userDto });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
