using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

using Server.Entity;


namespace Server.Services
{
	public class MessageService
	{
		DatabaseContext _context;

		public MessageService( DatabaseContext context )
		{
			_context = context;
		}

		public IAsyncEnumerable< Message > GetGuildMessages( Guild guild, int limit )
		{
			int count = _context.Messages.Where( x => x.Guild.ID == guild.ID ).Count();

			return _context.Messages
				.Include( x => x.Author )
				.Include( x => x.Guild )
				.Where( x => x.Guild.ID == guild.ID )
				.OrderBy( x => x.CreatedAt )
				.Skip( Math.Max( 0, count - limit ) )
				.AsAsyncEnumerable();
		}

		public async Task< Message > AddMessage( Identity identity, string message )
		{
			if( identity.Guild == null )
			{
				return null;
			}

			Message msg = new()
			{
				Author = identity,
				Guild  = identity.Guild,
				Text   = message,
			};

			await _context.AddAsync( msg );
			await _context.SaveChangesAsync();

			return msg;
		}
	}
}
