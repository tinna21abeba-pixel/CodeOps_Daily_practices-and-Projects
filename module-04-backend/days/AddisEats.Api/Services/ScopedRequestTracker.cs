namespace AddisEats.Api.Services;

public class ScopedRequestTracker : IScopedRequestTracker
{
    public Guid InstanceId { get; } = Guid.NewGuid();
    public string? Tag { get; set; }
}
