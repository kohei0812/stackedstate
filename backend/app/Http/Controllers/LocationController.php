<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index()
    {
        $locations = Location::all();
        return response()->json($locations);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);

        $location = Location::create([
            'name' => $request->name,
        ]);

        return response()->json($location, 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate(['name' => 'required|string|max:255']);

        $location = Location::findOrFail($id);
        $location->update([
            'name' => $request->name,
        ]);

        return response()->json($location);
    }

    public function destroy($id)
    {
        $location = Location::findOrFail($id);
        $location->delete();

        return response()->json(null, 204);
    }
}
