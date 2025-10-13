<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EnrollController extends Controller
{
    public function enroll(Request $request)
    {
        $username = $request->input('username');
        $password = $request->input('password');

        // Check students table
        $student = DB::table('students')->where('studentId', $username)->first();

        if ($student) {
            if ($student->status === 'Enrolled') {
                return response()->json(['message' => 'You are already enrolled'], 409);
            } elseif ($student->status === 'Not Enrolled' && $password === $student->password) {
                // In Laravel we use sessions or JWT; frontend can store ID in localStorage
                return response()->json(['studentId' => $username, 'redirect' => '/st_info']);
            } else {
                return response()->json(['message' => 'Incorrect password'], 401);
            }
        }

        // Check staff table
        $staff = DB::table('staff')->where('staffId', $username)->first();

        if ($staff) {
            if ($staff->status === 'Enrolled') {
                return response()->json(['message' => 'You are already enrolled'], 409);
            } elseif ($staff->status === 'Not Enrolled' && $password === $staff->password) {
                return response()->json(['staffId' => $username, 'redirect' => '/staff_info']);
            } else {
                return response()->json(['message' => 'Incorrect password'], 401);
            }
        }

        // If no match
        return response()->json(['message' => 'Username not found'], 404);
    }
}
