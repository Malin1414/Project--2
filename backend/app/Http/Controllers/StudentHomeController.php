<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;

class StudentHomeController extends Controller
{
    public function getProfile(Request $request)
    {
        $studentId = $request->session()->get('studentId');
        $loggedIn = $request->session()->get('logged_in');

        if (!$loggedIn || !$studentId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access. Please login first.'
            ], 403);
        }

        $student = DB::table('students as s')
            ->leftJoin('departments as d', 's.departmentId', '=', 'd.departmentId')
            ->leftJoin('batch as b', 's.batchId', '=', 'b.batchId')
            ->where('s.studentId', $studentId)
            ->select(
                's.studentId',
                's.name',
                's.email',
                's.status',
                's.profile_picture',
                'd.departmentName',
                'b.batch'
            )
            ->first();

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student profile not found'
            ]);
        }

        // Ensure all fields exist even if NULL
        $student = (array) $student;
        $student = array_merge([
            'studentId' => '',
            'name' => '',
            'email' => '',
            'status' => '',
            'profile_picture' => '',
            'departmentName' => '',
            'batch' => ''
        ], $student);

        return response()->json([
            'success' => true,
            'student' => $student
        ]);
    }

    public function updateProfilePicture(Request $request)
    {
        $studentId = $request->session()->get('studentId');
        $loggedIn = $request->session()->get('logged_in');

        if (!$loggedIn || !$studentId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access. Please login first.'
            ], 403);
        }

        if (!$request->hasFile('profile_picture')) {
            return response()->json([
                'success' => false,
                'message' => 'No file uploaded'
            ]);
        }

        $file = $request->file('profile_picture');

        // Validate file type
        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!in_array($file->getMimeType(), $allowedTypes)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid file type. Only JPG, PNG, GIF allowed.'
            ]);
        }

        // Validate size (max 2MB)
        if ($file->getSize() > 2 * 1024 * 1024) {
            return response()->json([
                'success' => false,
                'message' => 'File size too large. Maximum 2MB allowed.'
            ]);
        }

        // Store file
        $fileName = $studentId . '_' . time() . '.' . $file->getClientOriginalExtension();
        $uploadPath = 'uploads/profiles/' . $fileName;

        $file->move(public_path('uploads/profiles'), $fileName);

        // Update database
        $updated = DB::table('students')
            ->where('studentId', $studentId)
            ->update(['profile_picture' => $uploadPath]);

        if ($updated) {
            return response()->json([
                'success' => true,
                'message' => 'Profile picture updated successfully',
                'profile_picture' => $uploadPath
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to update profile picture in database'
        ]);
    }
}
