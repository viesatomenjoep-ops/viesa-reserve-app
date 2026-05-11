import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/v1/venues/[venueId]/availability
export async function GET(request: Request, { params }: { params: Promise<{ venueId: string }> }) {
  const { venueId } = await params;

  try {
    // 1. Fetch Locations for this venue
    const { data: locations } = await supabase
      .from('locations')
      .select('id')
      .eq('venue_id', venueId);

    const locationIds = locations?.map(loc => loc.id) || [];

    if (locationIds.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    // 2. Fetch Areas for these locations
    const { data: areas } = await supabase
      .from('areas')
      .select('id')
      .in('location_id', locationIds);

    const areaIds = areas?.map(area => area.id) || [];

    if (areaIds.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    // 3. Fetch Beds for these areas (Availability)
    const { data: beds, error: bedsError } = await supabase
      .from('beds')
      .select('id, area_id, name, price, min_spend, status, reserved_until')
      .in('area_id', areaIds);

    if (bedsError) throw bedsError;

    return NextResponse.json({
      success: true,
      data: beds || []
    });

  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
