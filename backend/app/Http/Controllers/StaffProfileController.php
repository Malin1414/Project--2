<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class StaffProfileController extends Controller
{
    // Fetch staff profile
    public function getProfile(Request $request)
    {
        if (!$request->user_id || $request->user_type !== 'staff') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $staffId = $request->user_id;

        $staff = DB::table('staff')
            ->where('staffId', $staffId)
            ->select('staffId as id', 'name', 'email', 'status', 'profile_picture')
            ->first();

        if ($staff) {
            return response()->json([
                'success' => true,
                'staff' => $staff
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Staff profile not found'
            ]);
        }
    }

    // Update profile picture
    public function updateProfilePicture(Request $request)
    {
        if (!$request->user_id || $request->user_type !== 'staff') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $staffId = $request->user_id;

        if (!$request->hasFile('profile_picture')) {
            return response()->json([
                'success' => false,
                'message' => 'No file uploaded'
            ]);
        }

        $file = $request->file('profile_picture');
        
        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

        if (!in_array($file->getClientMimeType(), $allowedTypes)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid file type. Only JPG, PNG, and GIF allowed.'
            ]);
        }

        if ($file->getSize() > 2 * 1024 * 1024) {
            return response()->json([
                'success' => false,
                'message' => 'File size too large. Maximum 2MB allowed.'
            ]);
        }

        // Delete old profile picture
        $oldPicture = DB::table('staff')
            ->where('staffId', $staffId)
            ->value('profile_picture');

        if ($oldPicture && Storage::disk('public')->exists(str_replace('/storage/', '', $oldPicture))) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $oldPicture));
        }

        // Save new profile picture
        $fileName = $staffId . '_' . time() . '.' . $file->getClientOriginalExtension();
        $filePath = $file->storeAs('uploads/profiles', $fileName, 'public');
        $profilePictureUrl = url('/storage/' . $filePath);

        DB::table('staff')->where('staffId', $staffId)->update(['profile_picture' => $profilePictureUrl]);

        return response()->json([
            'success' => true,
            'message' => 'Profile picture updated successfully',
            'profile_picture' => $profilePictureUrl
        ]);
    }
}
