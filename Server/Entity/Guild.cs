using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Server.Entity
{
	public class Guild
	{
		[Key]
		public Guid ID { get; set; }

		[MaxLength( 64 )]
		public string Name { get; set; }

		[JsonIgnore]
		public ICollection< Identity > Members { get; set; } = new List< Identity >();

		[JsonIgnore]
		public ICollection< Message > Messages { get; set; } = new List< Message >();

		public DateTime CreatedAt { get; set; } = DateTime.Now;

		public DateTime UpdatedAt { get; set; } = DateTime.Now;
	}
}
