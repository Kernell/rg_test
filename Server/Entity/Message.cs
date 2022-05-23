using System.ComponentModel.DataAnnotations;

namespace Server.Entity
{
	public class Message
	{
		[Key]
		public Guid ID { get; set; }

		public Identity Author { get; set; }

		public Guild Guild { get; set; }

		public string Text { get; set; }

		public DateTime CreatedAt { get; set; } = DateTime.Now;
	}
}
