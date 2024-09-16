using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Common.DataModel;
using Common.Interfaces;
using EmailServiceStateless.EmailServiceDB;
using MailKit.Security;
using MailKit.Net.Smtp;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using MimeKit;
using MimeKit.Text;

namespace EmailServiceStateless
{

    internal sealed class EmailServiceStateless : StatelessService, IEmailServiceStateless
    {
        private static string senderAddress = "";
        private static string senderAppPassword = "";
        private static string smtpServerAddress = "smtp.gmail.com";
        private static int smtpServerPortNumber = 587;

        public EmailServiceStateless(StatelessServiceContext context)
            : base(context)
        { }

        public async Task AddEmail(string email, string message)
        {
            try
            {
                await new EmailRepository().InsertEmailAsync(new Email() { Message = message, Receipent = email });
            }
            catch { }
        }

        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return new ServiceInstanceListener[0];
        }

        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            while (true)
            {
                Email email = await new EmailRepository().GetUnsentEmailsAsync();

                if (email.Id != 0 && await SendEmail(email.Message, email.Receipent, "Your account verification status has been changed."))
                    await new EmailRepository().UpdateEmailStatusAsync(email.Id, true);

                cancellationToken.ThrowIfCancellationRequested();
                await Task.Delay(TimeSpan.FromSeconds(15), cancellationToken);
            }
        }

        public static async Task<bool> SendEmail(string message, string to, string subject)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(senderAddress));
                email.To.Add(MailboxAddress.Parse(to));
                email.Subject = subject;
                email.Body = new TextPart(TextFormat.Plain) { Text = message };

                using (var smtp = new SmtpClient())
                {
                    await smtp.ConnectAsync(smtpServerAddress, smtpServerPortNumber, SecureSocketOptions.StartTls);
                    await smtp.AuthenticateAsync(senderAddress, senderAppPassword);
                    await smtp.SendAsync(email);
                    await smtp.DisconnectAsync(true);
                }

                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
