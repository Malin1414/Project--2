<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TokenAuthentication
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized - No token provided'
            ], 401);
        }

        // Verify token
        $session = DB::table('user_sessions')
            ->where('token', hash('sha256', $token))
            ->where('expires_at', '>', now())
            ->first();

        if (!$session) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized - Invalid or expired token'
            ], 401);
        }

        // Add user info to request
        $request->merge([
            'user_id' => $session->user_id,
            'user_type' => $session->user_type
        ]);

        return $next($request);
    }
}