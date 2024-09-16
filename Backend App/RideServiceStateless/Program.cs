using System;
using System.Diagnostics;
using System.Fabric;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.ServiceFabric.Services.Runtime;
using RideServiceStateless.RideServiceDatabase;

namespace RideServiceStateless
{
    internal static class Program
    {
        /// <summary>
        /// This is the entry point of the service host process.
        /// </summary>
        private static void Main()
        {
            try
            {
                // The ServiceManifest.XML file defines one or more service type names.
                // Registering a service maps a service type name to a .NET type.
                // When Service Fabric creates an instance of this service type,
                // an instance of the class is created in this host process.

                ServiceCollection serviceCollection = new();
                serviceCollection.AddAutoMapper(typeof(Mapping));
                ServiceProvider provider = serviceCollection.BuildServiceProvider();

                ServiceRuntime.RegisterServiceAsync("RideServiceStatelessType",
                    context => new RideServiceStateless(context, provider.GetRequiredService<IMapper>())).GetAwaiter().GetResult();

                ServiceEventSource.Current.ServiceTypeRegistered(Process.GetCurrentProcess().Id, typeof(RideServiceStateless).Name);

                // Prevents this host process from terminating so services keep running.
                Thread.Sleep(Timeout.Infinite);
            }
            catch (Exception e)
            {
                ServiceEventSource.Current.ServiceHostInitializationFailed(e.ToString());
                throw;
            }
        }
    }
}
