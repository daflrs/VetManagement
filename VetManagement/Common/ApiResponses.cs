using Microsoft.AspNetCore.Mvc;
using VetManagement.DTOs;

namespace VetManagement.Common
{
    public class ApiResponses
    {
        public static ObjectResult Conflict(string message)
        {
            return new ObjectResult(new ApiErrorResponse
            {
                Message = message,
                StatusCode = StatusCodes.Status409Conflict
            })
            {
                StatusCode = StatusCodes.Status409Conflict
            };
        }

        public static ObjectResult NotFound(string message)
        {
            return new ObjectResult(new ApiErrorResponse
            {
                Message = message,
                StatusCode = StatusCodes.Status404NotFound
            })
            {
                StatusCode = StatusCodes.Status404NotFound
            };
        }

        public static ObjectResult BadRequest(string message)
        {
            return new ObjectResult(new ApiErrorResponse
            {
                Message = message,
                StatusCode = StatusCodes.Status400BadRequest
            })
            {
                StatusCode = StatusCodes.Status400BadRequest
            };
        }
    }
}
