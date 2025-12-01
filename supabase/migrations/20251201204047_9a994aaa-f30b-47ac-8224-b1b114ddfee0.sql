-- Allow users to insert their own vendor role
CREATE POLICY "Users can insert their own vendor role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND role = 'vendor'::app_role
);