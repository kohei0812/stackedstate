<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::with('location')
        ->paginate(10);  // 1ページに10件を表示

    return response()->json([
        'posts' => $posts->items(),
        'totalPages' => $posts->lastPage(),
    ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'flyer_image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            'location_id' => 'required|exists:locations,id',
        ]);

        if ($request->hasFile('flyer_image')) {
            $imagePath = $request->file('flyer_image')->store('flyer_images', 'public');
        } else {
            $imagePath = null;
        }

        $post = Post::create([
            'date' => $request->date,
            'title' => $request->title,
            'content' => $request->content,
            'flyer_image' => $imagePath,
            'location_id' => $request->location_id,
        ]);

        return response()->json($post, 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $post = Post::with('location')->findOrFail($id);
        return response()->json($post);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'date' => 'required|date',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'flyer_image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            'location_id' => 'required|exists:locations,id',
        ]);

        $post = Post::findOrFail($id);

        if ($request->hasFile('flyer_image')) {
            if ($post->flyer_image) {
                Storage::disk('public')->delete($post->flyer_image);
            }
            $imagePath = $request->file('flyer_image')->store('flyer_images', 'public');
        } else {
            $imagePath = $post->flyer_image;
        }

        $post->update([
            'date' => $request->date,
            'title' => $request->title,
            'content' => $request->content,
            'flyer_image' => $imagePath,
            'location_id' => $request->location_id,
        ]);

        return response()->json($post);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        if ($post->flyer_image) {
            Storage::disk('public')->delete($post->flyer_image);
        }
        $post->delete();
        return response()->json(null, 204);
    }
}
