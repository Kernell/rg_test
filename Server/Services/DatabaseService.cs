using Microsoft.EntityFrameworkCore;

namespace Server.Services
{
	public class DatabaseService : IHostedService
	{
		public async Task StartAsync( CancellationToken cancellationToken )
		{
			using DatabaseContext db = new();

			await db.Database.MigrateAsync( cancellationToken );
		}

		public Task StopAsync( CancellationToken cancellationToken )
		{
			return Task.CompletedTask;
		}
	}
}
