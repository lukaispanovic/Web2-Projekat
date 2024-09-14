using Common;
using Common.DataModel;
using Common.DTOs;
using Common.Interfaces;
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
        private readonly IFileStorageService _fileStorageService = new FileStorageService("C:/Databases/ProfileImages");

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

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDTO data)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    string url = string.Empty;
                    if (data.file != null)
                    {
                        var fileUrl = await _fileStorageService.UploadFileAsync(data.file);
                        url = fileUrl;
                    }

                    if (url == string.Empty)
                        return BadRequest("Failed to upload profie image");
                    User newUser = ControllerMapper.ToUser(data, url);

                    UserDTO user = await _userService.RegisterUser(newUser);


                    if (user == null || user.Id == 0)
                        return NotFound("User with provided email already exists!");
                    else if (user.Id == -1)
                    {
                        return Unauthorized("That username is already taken!");
                    }
                    else
                    {
                        string isVerified = "false";
                        if (user.Verified != null)
                            isVerified = user.Verified.ToString();

                        string token = TokenService.Token((int)user.Id, user.UserType, isVerified);

                        return token != string.Empty ? Ok(new LoginResponseDTO() { Token = token, User = user }) : BadRequest();
                    }
                }
                catch
                {
                    return StatusCode(500);
                }
            }
            else
            {
                return BadRequest("Invalid request has been made!");
            }
        }
    }
}
