using Common.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class FileStorageService : IFileStorageService
    {
        private readonly string _storagePath;

        public FileStorageService(string storagePath)
        {
            _storagePath = storagePath;
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            try
            {
                if (!Directory.Exists(_storagePath))
                {
                    Directory.CreateDirectory(_storagePath);
                }

                var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine(_storagePath, uniqueFileName);
                using (var stream = System.IO.File.Create(filePath))
                {
                    await file.CopyToAsync(stream);
                }
                return filePath;
            }
            catch
            {
                return string.Empty;
            }
        }

        public async Task<string> GetFileStringAsync(string fileName)
        {
            var filePath = Path.Combine(_storagePath, fileName);

            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException("The specified file was not found.", fileName);
            }

            using (var reader = new StreamReader(filePath))
            {
                return await reader.ReadToEndAsync();
            }
        }

        public async Task<string> GetFileBase64StringAsync(string filePath)
        {
            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException("The specified file was not found.", filePath);
            }

            byte[] fileBytes = await File.ReadAllBytesAsync(filePath);

            string base64String = Convert.ToBase64String(fileBytes);

            string fileExtension = Path.GetExtension(filePath).ToLower();
            string mimeType = fileExtension == ".png" ? "image/png" : "image/jpeg";

            return $"data:{mimeType};base64,{base64String}";
        }
    }
}
