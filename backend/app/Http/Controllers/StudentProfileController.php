<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;

class StudentProfileController extends Controller
{
    // Get student profile
    public function getProfile(Request $request)
    {
       if (!$request->user_id || $request->user_type !== 'student') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

$studentId = $request->user_id;

        $student = DB::table('students as s')
            ->leftJoin('departments as d', 's.departmentId', '=', 'd.departmentId')
            ->leftJoin('batch as b', 's.batchId', '=', 'b.batchId')
            ->select(
                's.studentId',
                's.studentId as registrationNo',
                's.name',
                's.email',
                's.status',
                's.profile_picture',
                'd.departmentName as department',
                'b.batch as badge'
            )
            ->where('s.studentId', $studentId)
            ->first();

        if ($student) {
            return response()->json([
                'success' => true,
                'student' => $student
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Student profile not found'
            ]);
        }
    }

    // Update profile picture
    public function updateProfilePicture(Request $request)
    {
        if (!$request->user_id || $request->user_type !== 'student') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $studentId = $request->user_id;

        if (!$request->hasFile('profile_picture')) {
            return response()->json([
                'success' => false,
                'message' => 'No file uploaded'
            ]);
        }

        $file = $request->file('profile_picture');

        // Validate file type & size
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

        // Delete old profile picture if exists
        $oldPicture = DB::table('students')
            ->where('studentId', $studentId)
            ->value('profile_picture');
        
        if ($oldPicture && Storage::disk('public')->exists(str_replace('/storage/', '', $oldPicture))) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $oldPicture));
        }

        $fileName = $studentId . '_' . time() . '.' . $file->getClientOriginalExtension();
        $filePath = $file->storeAs('uploads/profiles', $fileName, 'public');

        // Construct the full URL
        $profilePictureUrl = url('/storage/' . $filePath);

        // Update database
        $updated = DB::table('students')
            ->where('studentId', $studentId)
            ->update(['profile_picture' => $profilePictureUrl]);

        if ($updated) {
            return response()->json([
                'success' => true,
                'message' => 'Profile picture updated successfully',
                'profile_picture' => $profilePictureUrl
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile picture'
            ]);
        }
    }

}

