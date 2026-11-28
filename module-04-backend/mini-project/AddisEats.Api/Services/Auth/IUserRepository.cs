using AddisEats.Api.Models;

namespace AddisEats.Api.Services.Auth

public interface IUserRepository
    {
        bool tryAdd(AppUser user);
        AppUser? getByEmail(string email);
        AppUser? GetById(Guid id);
        
    }