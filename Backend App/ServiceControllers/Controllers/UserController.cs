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

        [HttpPut("updateProfile")]
        public async Task<IActionResult> UpdateProfile([FromForm] UserEditDTO dto)
        {
            try
            {
                string url = string.Empty;
                if (dto.File != null)
                {
                    var fileUrl = await _fileStorageService.UploadFileAsync(dto.File);
                    url = fileUrl;
                }

                if (url == string.Empty)
                    return BadRequest("Failed to upload profie image");

                User data = ControllerMapper.EditToUser(dto, url);
                var updatedUserDto = await _userService.EditUser(data);
                return Ok(updatedUserDto);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("getUserData")]
        public async Task<IActionResult> GetUserData([FromQuery] int id)
        {
            try
            {
                var userDto = await _userService.GetUserById(id);
                return Ok((userDto));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("getPfPFromUserId")]
        public async Task<IActionResult> GetPfPFromUserId([FromQuery] string filename)
        {
            try
            {
                var userPfPString = await _fileStorageService.GetFileBase64StringAsync(filename);
                return Ok(userPfPString);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("verify/{username}/{v}")]
        public async Task<IActionResult> VerifyUser(string username, bool v)
        {

            if (TokenService.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "user_role") != "Admin")
                return Unauthorized("You don't have permission to read user data!");

            try
            {
                UserDTO user = await _userService.VerifyUser(username, v);

                if (user != null && user.Id != 0)
                {
                    string email = user.Email;
                    string poruka = $"Your account status is now: {(v ? "verified" : "rejected")}";


                    await ServiceProxy.Create<IEmailServiceStateless>(new Uri("fabric:/TaxiServiceFabric/EmailServiceStateless")).AddEmail(email, poruka);

                    return Ok("Verification status has been updated!");
                }
                else
                    return NotFound("User profile couldn't be found!");
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [HttpGet("getDrivers")]
        public async Task<IActionResult> GetDrivers()
        {
            try
            {
                if (TokenService.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "user_role") != "Admin")
                    return Unauthorized("You don't have permission to read users data!");
                var sellers = await _userService.GetDrivers();
                return Ok(sellers);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
