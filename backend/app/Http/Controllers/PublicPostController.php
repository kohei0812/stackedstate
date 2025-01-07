<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;

class PublicPostController extends Controller
{
    public function latestPosts()
    {
        $posts = Post::where('date', '>=', now()) // 今日以降の投稿を抽出
            ->orderBy('date', 'asc') // 日付順に並べる
            ->take(3) // 最新3件を取得
            ->with('location:id,name') // 関連する場所名を取得
            ->get();

        // 必要なデータのみ整形して返す
        $formattedPosts = $posts->map(function ($post) {
            return [
                'id' => $post ->id,
                'date' => $post->date,
                'title' => $post->title,
                'content' => $post->content,
                'flyer_image' => $post->flyer_image ? asset('storage/' . $post->flyer_image) : null, // 画像のフルURLを生成
                'location_name' => $post->location->name ?? '不明な場所', // 関連する場所名
            ];
        });

        return response()->json($formattedPosts);
    }
}
