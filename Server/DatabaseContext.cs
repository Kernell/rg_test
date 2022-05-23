using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

using Server.Entity;

namespace Server
{
	public class DatabaseContext : DbContext
	{
		public DbSet< Message >  Messages   => Set< Message >();
		public DbSet< Guild >    Guilds     => Set< Guild >();
		public DbSet< Identity > Identities => Set< Identity >();

		protected override void OnConfiguring( DbContextOptionsBuilder options )
		{
			string hostname = Environment.GetEnvironmentVariable( "MYSQL_HOST" );
			string database = Environment.GetEnvironmentVariable( "MYSQL_DATABASE" );
			string user     = Environment.GetEnvironmentVariable( "MYSQL_USER" );
			string password = Environment.GetEnvironmentVariable( "MYSQL_PASSWORD" );

			options.UseMySql( $"Server={hostname};Database={database};User={user};Password={password}", new MySqlServerVersion( new Version( 8, 0 ) ) );
		}
	}
}
