-- Create storage policies for photos bucket

-- Allow anyone to view photos (public bucket)
CREATE POLICY "Anyone can view photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'photos');

-- Allow admins to upload photos
CREATE POLICY "Admins can upload photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'photos' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to update photos
CREATE POLICY "Admins can update photos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'photos' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to delete photos
CREATE POLICY "Admins can delete photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'photos' 
  AND public.has_role(auth.uid(), 'admin')
);