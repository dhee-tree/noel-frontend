# API Request Utilities

This project uses a hybrid approach for making authenticated API requests to provide both convenience and flexibility.

## Usage

### 1. Client Components (Recommended - Using Hook)

For client components, use the `useApiRequest` hook which automatically includes the user's session token:

```typescript
"use client";
import { useApiRequest } from "@/hooks/useApiRequest";

function MyComponent() {
  const { apiRequest, isAuthenticated, session } = useApiRequest();

  const handleSubmit = async () => {
    try {
      // Token is automatically included
      const res = await apiRequest('/api/auth/verify-email/ABC123/', {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      const data = await res.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={handleSubmit}>Submit</button>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### 2. Server Components / API Routes (Direct Import)

For server components, API routes, or server actions, use the base `apiRequest` function directly:

```typescript
import { apiRequest } from "@/lib/utils";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
  const session = await getServerSession();
  
  try {
    const res = await apiRequest('/api/users/me', {
      method: 'GET',
      accessToken: session?.accessToken, // Explicitly pass token
    });

    if (!res.ok) {
      return Response.json({ error: 'Failed' }, { status: 500 });
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Error' }, { status: 500 });
  }
}
```

### 3. Public Endpoints (No Authentication)

For public endpoints that don't require authentication:

```typescript
import { apiRequest } from "@/lib/utils";

const res = await apiRequest('/api/public/status', {
  method: 'GET',
  // No accessToken needed
});
```

## API Reference

### `useApiRequest()` Hook

Returns an object with:
- `apiRequest(endpoint, options)` - Function to make authenticated requests
- `session` - Current session data
- `status` - Session status ("authenticated" | "loading" | "unauthenticated")
- `isAuthenticated` - Boolean indicating if user is authenticated
- `isLoading` - Boolean indicating if session is loading

### `apiRequest(endpoint, options)` Function

**Parameters:**
- `endpoint` (string) - API endpoint relative to `NEXT_PUBLIC_API_URL`
- `options` (object):
  - `method?` - HTTP method ("GET" | "POST" | "PUT" | "PATCH" | "DELETE")
  - `body?` - Request body (will be JSON stringified)
  - `accessToken?` - Bearer token for authentication
  - `headers?` - Additional headers

**Returns:** `Promise<Response>`

## Examples

### POST with Body
```typescript
const { apiRequest } = useApiRequest();

const res = await apiRequest('/api/users/profile', {
  method: 'POST',
  body: {
    name: 'John Doe',
    email: 'john@example.com',
  },
});
```

### Custom Headers
```typescript
const res = await apiRequest('/api/data', {
  method: 'GET',
  headers: {
    'X-Custom-Header': 'value',
  },
});
```

### Error Handling
```typescript
try {
  const res = await apiRequest('/api/endpoint', { method: 'POST' });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Request failed');
  }
  
  const data = await res.json();
  // Handle success
} catch (error) {
  // Handle error
  console.error(error);
}
```
