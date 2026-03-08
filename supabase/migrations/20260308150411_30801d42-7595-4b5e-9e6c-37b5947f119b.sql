
-- Allow anyone to upload to the media bucket
CREATE POLICY "Allow public uploads to media bucket"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'media');

-- Allow anyone to read from the media bucket
CREATE POLICY "Allow public reads from media bucket"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'media');

-- Allow anyone to update in the media bucket
CREATE POLICY "Allow public updates to media bucket"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'media');

-- Allow anyone to delete from the media bucket
CREATE POLICY "Allow public deletes from media bucket"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'media');
