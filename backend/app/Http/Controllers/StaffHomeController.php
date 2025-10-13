<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class StaffHomeController extends Controller
{
    public function getNotices(Request $request)
    {
        // Check if staff is logged in
        $staffId = $request->session()->get('staffId');
        $loggedIn = $request->session()->get('logged_in');

        if (!$loggedIn || !$staffId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access. Please login first.'
            ], 403);
        }

        // Fetch notices for this staff
        $notices = DB::table('notice')
            ->where('staffId', $staffId)
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($notice) {
                $notice->formattedDate = date('d-M-Y', strtotime($notice->date));
                return $notice;
            });

        return response()->json([
            'success' => true,
            'notices' => $notices
        ]);
    }

    public function deleteNotice(Request $request)
    {
        $staffId = $request->session()->get('staffId');
        $loggedIn = $request->session()->get('logged_in');

        if (!$loggedIn || !$staffId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access. Please login first.'
            ], 403);
        }

        $noticeId = $request->input('noticeId');

        $notice = DB::table('notice')
            ->where('noticeId', $noticeId)
            ->where('staffId', $staffId)
            ->first();

        if (!$notice) {
            return response()->json([
                'success' => false,
                'message' => 'Notice not found.'
            ]);
        }

        // Delete related records
        DB::table('notice_departments')->where('noticeId', $noticeId)->delete();
        DB::table('notice_batches')->where('noticeId', $noticeId)->delete();

        // Delete notice and attachment
        if ($notice->attachment && file_exists($notice->attachment)) {
            unlink($notice->attachment);
        }
        DB::table('notice')->where('noticeId', $noticeId)->where('staffId', $staffId)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notice deleted successfully'
        ]);
    }
}
