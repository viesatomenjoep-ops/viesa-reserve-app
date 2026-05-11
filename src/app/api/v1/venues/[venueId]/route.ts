import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/v1/venues/[venueId]
export async function GET(request: Request, { params }: { params: Promise<{ venueId: string }> }) {
  const { venueId } = await params;

  try {
    // 1. Fetch Venue
    const { data: venue, error: venueError } = await supabase
      .from('venues')
      .select('id, name, location_address, map_image_url, logo_url, created_at')
      .eq('id', venueId)
      .single();

    if (venueError || !venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    }

    // 2. Fetch Locations (Main Zones)
    const { data: locations } = await supabase
      .from('locations')
      .select('id, name, pos_x, pos_y, sort_order')
      .eq('venue_id', venueId)
      .order('sort_order', { ascending: true });

    // 3. Fetch Areas (Sub Zones)
    const locationIds = locations?.map(loc => loc.id) || [];
    const { data: areas } = await supabase
      .from('areas')
      .select('id, location_id, name, type, pos_x, pos_y')
      .in('location_id', locationIds.length > 0 ? locationIds : ['00000000-0000-0000-0000-000000000000']);

    // Build the hierarchical response
    const payload = {
      ...venue,
      locations: locations?.map(loc => ({
        ...loc,
        areas: areas?.filter(area => area.location_id === loc.id) || []
      })) || []
    };

    return NextResponse.json({
      success: true,
      data: payload
    });

  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
