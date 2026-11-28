using System.Collections.Concurrent;
using AddisEats.Api.Models;

namespace AddisEats.Api.Services.Auth;

public class InMemoryUserRepository : IUserRepository
{
    private readonly ConcurrentDictionary<string, AppUser> _users =
        new(StringComparer.OrdinalIgnoreCase);

    public bool TryAdd(AppUser user)
    {
        string email = user.Email.Trim();
        user.Email = email;

        return _users.TryAdd(email, user);
    }

    public AppUser? GetByEmail(string email)
    {
        _users.TryGetValue(email.Trim(), out var user);
        return user;
    }

    public AppUser? GetById(Guid id)
    {
        return _users.Values.FirstOrDefault(user => user.Id == id);
    }
}