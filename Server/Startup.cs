using System.Net;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Tokens;

using Server.Hubs;
using Server.Services;

namespace Server
{
	public class Startup
	{
		IConfiguration _configuration;

		public Startup( IConfiguration configuration )
		{
			_configuration = configuration;
		}

		public void ConfigureServices( IServiceCollection services )
		{
			services
				.AddDbContext< DatabaseContext >()
				.AddHostedService< DatabaseService >()
				.AddScoped< IdentityService >()
				.AddScoped< MessageService >();

			services
				.AddSignalR()
				.AddJsonProtocol( options =>
					options.PayloadSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase
				)
				.AddStackExchangeRedis( options =>
				{
					options.Configuration.ChannelPrefix = "ChatServer";
					options.Configuration.EndPoints.Add( _configuration[ "REDIS_HOST" ], _configuration.GetValue< int >( "REDIS_PORT" ) );
					options.Configuration.Password     = _configuration[ "REDIS_PASSWORD" ];
				}
			);

			services.AddAuthentication( JwtBearerDefaults.AuthenticationScheme )
				.AddJwtBearer( options =>
				{
					options.TokenValidationParameters = new TokenValidationParameters
					{
						ValidateAudience = false,
						ValidateIssuer   = false,
						ValidateActor    = false,
						ValidateLifetime = true,
						IssuerSigningKey = new SymmetricSecurityKey( Encoding.ASCII.GetBytes( _configuration[ "Jwt:IssuerSigningKey" ] ) )
					};

					options.Events = new JwtBearerEvents
					{
						OnMessageReceived = context =>
						{
							StringValues accessToken = context.Request.Query[ "token" ];
							PathString path = context.HttpContext.Request.Path;

							if( !string.IsNullOrEmpty( accessToken ) && ( path.StartsWithSegments( "/hubs/chat" ) ) )
							{
								context.Token = accessToken;
							}

							return Task.CompletedTask;
						}
					};
				}
			);

			services.AddAuthorization( options =>
				{
					options.AddPolicy( JwtBearerDefaults.AuthenticationScheme, policy =>
						{
							policy.AddAuthenticationSchemes( JwtBearerDefaults.AuthenticationScheme );
							policy.RequireClaim( ClaimTypes.Name );
						}
					);
				}
			);

			services.AddCors( options =>
			{
				options.AddPolicy( "Any", policy =>
				{
					policy
						.WithOrigins( "http://localhost:3000" )
						.AllowAnyHeader()
						.AllowAnyMethod()
						.AllowCredentials();
				} );
			} );
		}

		public void Configure( IApplicationBuilder app, IWebHostEnvironment env )
		{
			if( env.IsDevelopment() )
			{
				app.UseDeveloperExceptionPage();
				app.UseCors( "Any" );
			}

			app.UseRouting();
			app.UseAuthentication();
			app.UseAuthorization();

			app.UseEndpoints( endpoints =>
				{
					endpoints.MapHub< IdentityHub >( "/hubs/id" );
					endpoints.MapHub< ChatHub >( "/hubs/chat" );
				}
			);
		}
	}
}
