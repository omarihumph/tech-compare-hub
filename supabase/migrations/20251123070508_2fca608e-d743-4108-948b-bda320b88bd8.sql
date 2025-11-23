-- Create a trigger to automatically add vendor role when vendor profile is created
CREATE OR REPLACE FUNCTION public.handle_new_vendor()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Insert vendor role into user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.user_id, 'vendor')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger that fires after vendor profile insert
DROP TRIGGER IF EXISTS on_vendor_profile_created ON public.vendor_profiles;

CREATE TRIGGER on_vendor_profile_created
  AFTER INSERT ON public.vendor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_vendor();