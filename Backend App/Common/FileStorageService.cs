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
    }
}
