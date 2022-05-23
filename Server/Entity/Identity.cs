using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Server.Entity
{
	public class Identity
	{
		[Key]
		public Guid ID { get; set; }

		[MaxLength( 64 )]
		public string Name { get; set; }

		[MaxLength( 64 )]
		public string Login { get; set; }

		[MaxLength( 128 )]
		[JsonIgnore]
		public string Password { get; set; }

		public Guild Guild { get; set; }

		public DateTime CreatedAt { get; set; } = DateTime.Now;

		public DateTime UpdatedAt { get; set; } = DateTime.Now;
	}
}
