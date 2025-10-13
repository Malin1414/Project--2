<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class ChangePasswordController extends Controller
{
    public function update(Request $request)
    {
        // Check if user is logged in
        $userType = $request->session()->get('user_type');
        $userId = null;

        if (!$request->session()->get('logged_in') || !$userType) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access. Please login first.'
            ], 403);
        }

        // Determine table and id column
        if ($userType === 'student') {
            $table = 'students';
            $idColumn = 'studentId';
            $userId = $request->session()->get('studentId');
        } elseif ($userType === 'staff') {
            $table = 'staff';
            $idColumn = 'staffId';
            $userId = $request->session()->get('staffId');
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Invalid user type.'
            ], 400);
        }

        // Validate input
        $request->validate([
            'currentPassword' => 'required|string',
            'newPassword' => 'required|string|min:8',
            'confirmPassword' => 'required|string'
        ]);

        $currentPassword = $request->currentPassword;
        $newPassword = $request->newPassword;
        $confirmPassword = $request->confirmPassword;

        if ($newPassword !== $confirmPassword) {
            return response()->json([
                'success' => false,
                'message' => 'New passwords do not match.'
            ], 400);
        }

        // Fetch user password hash
        $user = DB::table($table)->where($idColumn, $userId)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.'
            ], 404);
        }

        if (!Hash::check($currentPassword, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect.'
            ], 400);
        }

        // Update password
        DB::table($table)->where($idColumn, $userId)->update([
            'password' => Hash::make($newPassword)
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully!'
        ]);
    }
}
