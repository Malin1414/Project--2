<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class EnrollController extends Controller
{
    public function enroll(Request $request)
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
            ], 400);
        }

        $username = $request->username;
        $password = $request->password;

        // Check in students table
        $student = DB::table('students')
            ->where('studentId', $username)
            ->first();

        if ($student) {
            // Check if already enrolled
            if ($student->status === 'Enrolled') {
                return response()->json([
                    'success' => false,
                    'message' => 'You are already enrolled',
                    'redirect' => 'login'
                ], 200);
            }
            
            // Check if not enrolled and password matches
            if ($student->status === 'Not Enrolled') {
               if ($password === $student->password) {
                    return response()->json([
                        'success' => true,
                        'message' => 'Please complete your enrollment information',
                        'user_type' => 'student',
                        'user_id' => $student->studentId
                    ], 200);
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Incorrect password'
                    ], 200);
                }
            }
        }

        // Check in staff table
        $staff = DB::table('staff')
            ->where('staffId', $username)
            ->first();

        if ($staff) {
            // Check if already enrolled
            if ($staff->status === 'Enrolled') {
                return response()->json([
                    'success' => false,
                    'message' => 'You are already enrolled',
                    'redirect' => 'login'
                ], 200);
            }
            
            // Check if not enrolled and password matches
            if ($staff->status === 'Not Enrolled') {
                if ($password === $staff->password) {
                    return response()->json([
                        'success' => true,
                        'message' => 'Please complete your enrollment information',
                        'user_type' => 'staff',
                        'user_id' => $staff->staffId
                    ], 200);
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Incorrect password'
                    ], 200);
                }
            }
        }

        // If no match in either table
        return response()->json([
            'success' => false,
            'message' => 'Username not found'
        ], 200);
    }
}