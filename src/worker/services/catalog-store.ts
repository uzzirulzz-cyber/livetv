interface CatalogDatabase {
  prepare(query: string): {
    run(): Promise<unknown>;
    bind(...values: (string | number | null)[]): {
      run(): Promise<unknown>;
      all<T>(): Promise<{ results: T[] }>;
    };
    all<T>(): Promise<{ results: T[] }>;
  };
  batch(statements: { run(): Promise<unknown> }[]): Promise<unknown[]>;
}

interface CatalogChannel {
  id?: string;
  name?: string;
  rawName?: string;
  rawLogo?: string;
  logo?: string;
  group?: string;
  category?: string;
  epgId?: string;
  streamId?: string;
  hlsUrl?: string;
}

export const MAX_CATALOG_CHANNELS = 15_000;

interface CatalogRow {
  channel_id: string;
  name: string;
  raw_name: string | null;
  logo_url: string | null;
  group_title: string;
  category: string;
  epg_id: string | null;
  stream_id: string;
}

export async function readChannelCatalog(
  database: CatalogDatabase,
  playbackBaseUrl: string
): Promise<CatalogChannel[]> {
  const { results } = await database.prepare(`
    SELECT channel_id, name, raw_name, logo_url, group_title, category, epg_id, stream_id
    FROM catalog_channels
    ORDER BY group_title, name
  `).all<CatalogRow>();

  return results.map((row) => ({
    id: row.channel_id,
    name: row.name,
    rawName: row.raw_name ?? undefined,
    rawLogo: row.logo_url ?? undefined,
    logo: row.logo_url ? `/api/iptv/image?url=${encodeURIComponent(row.logo_url)}` : '',
    group: row.group_title,
    category: row.category,
    epgId: row.epg_id ?? undefined,
    streamId: row.stream_id,
    hlsUrl: `${playbackBaseUrl}/broadcast/api/iptv/hls/stream.m3u8?channelId=${encodeURIComponent(row.stream_id)}`,
  }));
}

export async function persistChannelCatalog(
  database: CatalogDatabase,
  channels: CatalogChannel[]
): Promise<void> {
  if (channels.length > MAX_CATALOG_CHANNELS) {
    throw new Error('Channel catalog exceeded the supported size.');
  }
  if (channels.length === 0) {
    await database.prepare('DELETE FROM catalog_channels').run();
    return;
  }

  const syncedAt = new Date().toISOString();
  const statements = channels.map((channel) => {
    if (!channel.id || !channel.name || !channel.streamId) {
      throw new Error('Channel catalog contains an incomplete record.');
    }

    return database.prepare(`
      INSERT INTO catalog_channels (
        channel_id, name, raw_name, logo_url, group_title,
        category, epg_id, stream_id, last_synced_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(channel_id) DO UPDATE SET
        name = excluded.name,
        raw_name = excluded.raw_name,
        logo_url = excluded.logo_url,
        group_title = excluded.group_title,
        category = excluded.category,
        epg_id = excluded.epg_id,
        stream_id = excluded.stream_id,
        last_synced_at = excluded.last_synced_at
    `).bind(
      channel.id,
      channel.name,
      channel.rawName ?? null,
      channel.rawLogo ?? null,
      channel.group ?? 'General',
      channel.category ?? 'Entertainment',
      channel.epgId ?? null,
      channel.streamId,
      syncedAt
    );
  });

  for (let index = 0; index < statements.length; index += 100) {
    await database.batch(statements.slice(index, index + 100));
  }

  await database.prepare('DELETE FROM catalog_channels WHERE last_synced_at <> ?')
    .bind(syncedAt)
    .run();
}
