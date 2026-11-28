using AddisEats.Api.Models;

namespace AddisEats.Api.Services.Auth;

public interface IUserRepository
{
    bool TryAdd(AppUser user);
    AppUser? GetByEmail(string email);
    AppUser? GetById(Guid id);
}