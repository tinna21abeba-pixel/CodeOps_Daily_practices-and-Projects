namespace AddisEats.Api.Services;

using AddisEats.Api.Models;

public interface IUserStore
{
    User? GetById(int id);
    User? GetByMobileNumber(string mobileNumber);
    bool TryAdd(User user);
    void Update(User user);
}
