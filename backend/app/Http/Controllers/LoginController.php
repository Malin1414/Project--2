<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller
{
    /* Handle user login */
    public function login(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Please fill in all fields'
            ], 200);
        }

        $username = $request->username;
        $password = $request->password;

        // Check in staff table first
        $staff = DB::table('staff')
            ->where('staffId', $username)
            ->first();

        if ($staff) {
            // Check if staff member is enrolled
            if ($staff->status === 'Not Enrolled') {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not enrolled yet. Please enroll first.'
                ], 200);
            }

            // Verify password
            if (Hash::check($password, $staff->password)) {
                // Create session/token
                $token = $this->createToken($staff->staffId, 'staff');

                return response()->json([
                    'success' => true,
                    'message' => 'Login successful',
                    'user_type' => 'staff',
                    'user_id' => $staff->staffId,
                    'token' => $token,
                    'redirect' => '/staff-home'
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Incorrect password'
                ], 200);
            }
        }

        // Check in students table
        $student = DB::table('students')
            ->where('studentId', $username)
            ->first();

        if ($student) {
            // Check if student is enrolled
            if ($student->status === 'Not Enrolled') {
                return response()->json([
                    'success' => false,
                    'message' => 'You have not enrolled yet. Please enroll first.',
                ], 200);
            }

            // Verify password
            if (Hash::check($password, $student->password)) {
                // Create session/token
                $token = $this->createToken($student->studentId, 'student');

                return response()->json([
                    'success' => true,
                    'message' => 'Login successful',
                    'user_type' => 'student',
                    'user_id' => $student->studentId,
                    'token' => $token,
                    'redirect' => '/student-home'
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Incorrect password'
                ], 200);
            }
        }

        // User not found in either table
        return response()->json([
            'success' => false,
            'message' => 'Your username is incorrect'
        ], 200);
    }

    /**
     * Create authentication token
     */
    private function createToken($userId, $userType)
    {
        $token = bin2hex(random_bytes(32));
        
        // Store token in sessions table 
        DB::table('user_sessions')->insert([
            'user_id' => $userId,
            'user_type' => $userType,
            'token' => hash('sha256', $token),
            'created_at' => now(),
            'expires_at' => now()->addHours(24)
        ]);

        return $token;
    }

    /* Handle user logout*/
    public function logout(Request $request)
    {
        $token = $request->bearerToken();
        
        if ($token) {
            DB::table('user_sessions')
                ->where('token', hash('sha256', $token))
                ->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ], 200);
    }

    /* Verify token and get user info */
    public function verifyToken(Request $request)
    {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'No token provided'
            ], 401);
        }

        $session = DB::table('user_sessions')
            ->where('token', hash('sha256', $token))
            ->where('expires_at', '>', now())
            ->first();

        if (!$session) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'user_id' => $session->user_id,
            'user_type' => $session->user_type
        ], 200);
    }
}