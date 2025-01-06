import { NextResponse } from 'next/server';
import { createClient } from '@vercel/postgres'; // Change this import

const INACTIVITY_PERIOD_MINUTES = 15;

export async function GET() {
  const client = createClient(); // Use createClient() instead of db.connect()

  try {
    // SQL query to update users' online status based on inactivity
    const updateQuery = `
      UPDATE users
      SET online = false
      WHERE last_action < NOW() - INTERVAL '${INACTIVITY_PERIOD_MINUTES} minutes'
      AND online = true;
    `;
    await client.query(updateQuery);

    return NextResponse.json({
      message: `Inactivity check completed. Users inactive for more than ${INACTIVITY_PERIOD_MINUTES} minutes are now offline.`,
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 });
  } finally {
    await client.end(); // Ensure to close the client connection
  }
}