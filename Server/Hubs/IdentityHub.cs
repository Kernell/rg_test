using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

using Server.Entity;
using Server.HubMessages;
using Server.Services;

namespace Server.Hubs
{
	public class IdentityHub : Hub
	{
		IdentityService _identityService;

		public IdentityHub( IConfiguration configuration, IdentityService identityService )
		{
			_identityService = identityService;
		}

		public async Task Authorize( string login, string password )
		{
			Identity identity = await _identityService.Authorize( login, password );

			if( identity == null )
			{
				await Clients.Caller.SendAsync( "AuthorizeResult", new AuthorizeResult { Error = "Invalid login or password" } );

				return;
			}

			string token = _identityService.GenerateToken( identity );

			await Clients.Caller.SendAsync( "AuthorizeResult", new AuthorizeResult { Token = token } );
		}

		public async Task Register( string name, string login, string password )
		{
			if( name?.Length < 3 )
			{
				await Clients.Caller.SendAsync( "RegisterResult", new RegisterResult { Error = "The name should be 3 to 64 characters long" } );

				return;
			}

			if( login?.Length < 3 )
			{
				await Clients.Caller.SendAsync( "RegisterResult", new RegisterResult { Error = "The login should be 3 to 64 characters long" } );

				return;
			}

			if( password?.Length < 3 )
			{
				await Clients.Caller.SendAsync( "RegisterResult", new RegisterResult { Error = "The password should be 3 to 64 characters long" } );

				return;
			}

			Identity identity = await _identityService.Register( name, login, password );

			if( identity == null )
			{
				await Clients.Caller.SendAsync( "RegisterResult", new RegisterResult { Error = "This user already exists" } );

				return;
			}

			string token = _identityService.GenerateToken( identity );

			await Clients.Caller.SendAsync( "RegisterResult", new AuthorizeResult { Token = token } );
		}

		[Authorize]
		public async Task ChangePassword( string currentPassword, string newPassword )
		{
			if( newPassword?.Length < 3 )
			{
				return;
			}

			await _identityService.ChangePassword( Context.User.Identity.Name, currentPassword, newPassword );
		}
	}
}
