namespace AddisEats.Api.DTOs;

public record PagedResponse<T>(
    IReadOnlyList<T> Data,
    int Page,
    int PageSize
);
