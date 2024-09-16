using Common.DataModel;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmailServiceStateless.EmailServiceDB
{
    public class EmailRepository
    {
        public EmailRepository()
        {
            using (var context = new EmailDbContext())
            {
                context.Database.EnsureCreated();
            }
        }

        public async Task<Email> InsertEmailAsync(Email email)
        {
            if (email == null)
                return new Email();

            using var context = new EmailDbContext();
            var added = context.Emails.Add(email);
            await context.SaveChangesAsync();
            return added.Entity;
        }

        public async Task<bool> UpdateEmailStatusAsync(int id, bool sent)
        {
            using var context = new EmailDbContext();
            var email = await context.Emails.FindAsync(id);

            if (email != null)
            {
                email.Sent = sent;
                await context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<Email> GetUnsentEmailsAsync()
        {
            using var context = new EmailDbContext();
            return await context.Emails.AsNoTracking().FirstOrDefaultAsync(e => e.Sent == false) ?? new Email();
        }
    }
}
