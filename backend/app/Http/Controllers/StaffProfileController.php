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
        $staffId = $request->session()->get('staffId');

        if (!$staffId) {
            return response()->json(['error' => 'Not logged in'], 403);
        }

        $staff = DB::table('staff')->where('staffId', $staffId)->first();

        if (!$staff) {
            return response()->json(['error' => 'Staff profile not found'], 404);
        }

        return response()->json([
            'staff' => [
                'id' => $staff->staffId,
                'name' => $staff->name,
                'email' => $staff->email,
                'status' => $staff->status,
                'profile_picture' => $staff->profile_picture ?? null
            ]
        ]);
    }

    // Update profile picture
    public function updateProfilePicture(Request $request)
    {
        $staffId = $request->session()->get('staffId');

        if (!$staffId) {
            return response()->json(['error' => 'Not logged in'], 403);
        }

        if (!$request->hasFile('profile_picture')) {
            return response()->json(['error' => 'No file uploaded'], 400);
        }

        $file = $request->file('profile_picture');
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!in_array($file->getMimeType(), $allowedTypes)) {
            return response()->json(['error' => 'Invalid file type'], 400);
        }

        if ($file->getSize() > 2 * 1024 * 1024) {
            return response()->json(['error' => 'File too large'], 400);
        }

        $fileName = $staffId . '_' . time() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('public/profiles', $fileName);

        DB::table('staff')->where('staffId', $staffId)->update([
            'profile_picture' => $path
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profile picture updated successfully',
            'profile_picture' => $path
        ]);
    }
}
