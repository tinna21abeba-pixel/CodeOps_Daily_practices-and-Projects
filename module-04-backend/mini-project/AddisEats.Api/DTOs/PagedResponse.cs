namespace AddisEats.Api.DTOs;

/// <summary>
/// Paginated response envelope containing a page slice and paging metadata.
/// </summary>
/// <typeparam name="T">Item type returned in the page.</typeparam>
public record PagedResponse<T>
{
    /// <summary>
    /// Items returned for the requested page.
    /// </summary>
    public IReadOnlyList<T> Data { get; init; }

    /// <summary>
    /// Current 1-based page index.
    /// </summary>
    /// <example>1</example>
    public int Page { get; init; }

    /// <summary>
    /// Number of items requested per page.
    /// </summary>
    /// <example>10</example>
    public int PageSize { get; init; }

    public PagedResponse(IReadOnlyList<T> data, int page, int pageSize)
    {
        Data = data;
        Page = page;
        PageSize = pageSize;
    }
}
