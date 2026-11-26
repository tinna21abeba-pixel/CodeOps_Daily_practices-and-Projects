namespace AddisEats.Api.Services;

public interface IScopedRequestTracker
{
    Guid InstanceId { get; }
    string? Tag { get; set; }
}
