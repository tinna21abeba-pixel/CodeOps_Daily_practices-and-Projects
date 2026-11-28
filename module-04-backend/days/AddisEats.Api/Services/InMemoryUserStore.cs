namespace AddisEats.Api.Services;

using AddisEats.Api.Data;
using AddisEats.Api.Models;
using Microsoft.AspNetCore.Identity;

public class InMemoryUserStore : IUserStore
{
    private readonly object _gate = new();
    private readonly List<User> _users;
    private int _nextId;

    public InMemoryUserStore(IPasswordHasher<User> passwordHasher)
    {
        _users = SeedData.CreateSeedUsers(passwordHasher);
        _nextId = _users.Count > 0 ? _users.Max(u => u.Id) + 1 : 1;
    }

    public static string NormalizeMobile(string mobileNumber)
    {
        var trimmed = mobileNumber.Trim();
        if (trimmed.StartsWith("0", StringComparison.Ordinal))
        {
            return "+251" + trimmed[1..];
        }

        return trimmed;
    }

    public User? GetById(int id)
    {
        lock (_gate)
        {
            return _users.FirstOrDefault(u => u.Id == id);
        }
    }

    public User? GetByMobileNumber(string mobileNumber)
    {
        var normalized = NormalizeMobile(mobileNumber);
        lock (_gate)
        {
            return _users.FirstOrDefault(u => string.Equals(u.MobileNumber, normalized, StringComparison.Ordinal));
        }
    }

    public bool TryAdd(User user)
    {
        var normalized = NormalizeMobile(user.MobileNumber);
        lock (_gate)
        {
            if (_users.Any(u => string.Equals(u.MobileNumber, normalized, StringComparison.Ordinal)))
            {
                return false;
            }

            user.Id = _nextId++;
            user.MobileNumber = normalized;
            _users.Add(user);
            return true;
        }
    }

    public void Update(User user)
    {
        lock (_gate)
        {
            var index = _users.FindIndex(u => u.Id == user.Id);
            if (index >= 0)
            {
                _users[index] = user;
            }
        }
    }
}
