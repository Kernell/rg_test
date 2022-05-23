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
	public class IdentityService
	{
		private readonly DatabaseContext _context;

		private readonly IConfiguration _configuration;

		private SymmetricSecurityKey _securityKey;

		private PasswordHasher< Identity > _hasher;

		public static readonly JwtSecurityTokenHandler JwtTokenHandler = new();

		public const int DEFAULT_TOKEN_LIFETIME = 5 * 60 * 24 * 7; // minutes

		public int TokenLifetime
		{
			get
			{
				string value = _configuration[ "Jwt:TokenLifetime" ];

				if( !string.IsNullOrEmpty( value ) && int.TryParse( value, out int result ) )
				{
					return result;
				}

				return DEFAULT_TOKEN_LIFETIME;
			}
		}

		public IdentityService( IConfiguration configuration, DatabaseContext context )
		{
			_context       = context;
			_configuration = configuration;
			_securityKey   = new SymmetricSecurityKey( Encoding.ASCII.GetBytes( _configuration[ "Jwt:IssuerSigningKey" ] ) );
			_hasher        = new PasswordHasher< Identity >();
		}

		public async Task< Identity > Authorize( string login, string password )
		{
			if( await _context.Identities.Include( x => x.Guild ).FirstOrDefaultAsync( x => x.Login == login ) is Identity identity )
			{
				if( string.IsNullOrEmpty( identity.Password ) )
				{
					return null;
				}

				if( VerifyPasswordHash( password, identity.Password ) == PasswordVerificationResult.Failed )
				{
					return null;
				}

				return identity;
			}

			return null;
		}

		public async Task< Identity > Register( string name, string login, string password )
		{
			if( await _context.Identities.AnyAsync( x => x.Login == login || x.Name == name ) )
			{
				return null;
			}

			Identity identity = new()
			{
				Login    = login,
				Name     = name,
				Password = HashPassword( password )
			};

			await _context.AddAsync( identity );
			await _context.SaveChangesAsync();

			return identity;
		}

		public async Task< Guild > ChangeGuild( Identity identity, string guildName )
		{
			if( identity.Guild != null )
			{
				identity.Guild = null;
			}

			Guild guild = await _context.Guilds.FirstOrDefaultAsync( x => x.Name.ToLower() == guildName.ToLower() );

			if( guild == null )
			{
				guild = new()
				{
					Name = guildName,
				};

				await _context.AddAsync( guild );
			}

			identity.Guild = guild;

			await _context.SaveChangesAsync();

			return guild;
		}

		public async Task< bool > ChangePassword( string login, string currentPassword, string newPassword )
		{
			if( await _context.Identities.FirstOrDefaultAsync( x => x.Login == login ) is Identity identity )
			{
				if( VerifyPasswordHash( currentPassword, identity.Password ) == PasswordVerificationResult.Failed )
				{
					return false;
				}

				identity.Password = HashPassword( newPassword );

				await _context.SaveChangesAsync();
			}

			return false;
		}

		public async Task< Identity > GetIdentity( HubCallerContext context )
		{
			return await _context.Identities.Include( x => x.Guild ).FirstOrDefaultAsync( x => x.Login == context.User.Identity.Name );
		}

		public bool TryValidateIdentity( ClaimsPrincipal claimsPrincipal )
		{
			return _context.Identities.Any( x => x.Login == claimsPrincipal.Identity.Name );
		}

		public string GenerateToken( Identity identity )
		{
			if( identity == null )
			{
				throw new ArgumentNullException( nameof( identity ) );
			}

			List< Claim > claims = new()
			{
				new Claim( ClaimTypes.Name, identity.Login ),
			};

			SigningCredentials credentials = new( _securityKey, SecurityAlgorithms.HmacSha256 );
			JwtSecurityToken token = new( issuer: null, audience: null, claims, expires: DateTime.Now.AddMinutes( TokenLifetime ), signingCredentials: credentials );

			return JwtTokenHandler.WriteToken( token );
		}

		public string HashPassword( string password )
		{
			return _hasher.HashPassword( null, password );
		}

		public PasswordVerificationResult VerifyPasswordHash( string password, string passwordHashed )
		{
			return _hasher.VerifyHashedPassword( null, passwordHashed, password );
		}
	}
}
