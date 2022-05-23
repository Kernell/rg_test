using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

using Server.Entity;
using Server.HubMessages;
using Server.Services;

namespace Server.Hubs
{
	[Authorize]
	public class ChatHub : Hub
	{
		IdentityService _identityService;
		MessageService _messageService;

		public ChatHub( IdentityService identityService, MessageService messageService )
		{
			_identityService = identityService;
			_messageService = messageService;
		}

		public override async Task OnConnectedAsync()
		{
			if( await _identityService.GetIdentity( Context ) is Identity identity )
			{
				if( identity.Guild != null )
				{
					await Groups.AddToGroupAsync( Context.ConnectionId, identity.Guild.ID.ToString() );
				}

				await Clients.Caller.SendAsync( "OnConnected" );
			}

			await base.OnConnectedAsync();
		}

		public async Task GetHistory( int limit )
		{
			if( await _identityService.GetIdentity( Context ) is Identity identity )
			{
				if( identity.Guild != null )
				{
					await foreach( Message message in _messageService.GetGuildMessages( identity.Guild, limit ) )
					{
						await Clients.Caller.SendAsync( "ReceiveMessage", message );
					}
				}
			}
		}

		public async Task SetGuild( string guildName )
		{
			if( guildName?.Count() < 3 )
			{
				return;
			}

			if( await _identityService.GetIdentity( Context ) is Identity identity )
			{
				if( identity.Guild != null )
				{
					await Groups.RemoveFromGroupAsync( Context.ConnectionId, identity.Guild.ID.ToString() );
				}

				Guild guild = await _identityService.ChangeGuild( identity, guildName );

				await Groups.AddToGroupAsync( Context.ConnectionId, guild.ID.ToString() );
			}
		}

		public async Task GetIdentity()
		{
			if( await _identityService.GetIdentity( Context ) is Identity identity )
			{
				await Clients.Caller.SendAsync( "ReceiveIdentity", identity );
			}
		}

		public async Task SendMessage( string message )
		{
			if( string.IsNullOrEmpty( message ) )
			{
				return;
			}

			if( await _identityService.GetIdentity( Context ) is Identity identity )
			{
				if( await _messageService.AddMessage( identity, message ) is Message msg )
				{
					await Clients.Group( identity.Guild.ID.ToString() )?.SendAsync( "ReceiveMessage", msg );
				}
			}
		}
	}
}
