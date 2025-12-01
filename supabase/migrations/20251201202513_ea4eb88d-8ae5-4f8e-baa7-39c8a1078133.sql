-- Create function to handle vendor signup
CREATE OR REPLACE FUNCTION public.handle_vendor_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if user signed up as vendor
  IF NEW.raw_user_meta_data->>'role' = 'vendor' THEN
    -- Create vendor profile
    INSERT INTO public.vendor_profiles (user_id, company_name, is_approved)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'company_name', NEW.raw_user_meta_data->>'full_name', 'New Vendor'),
      false
    );
    
    -- The handle_new_vendor trigger will automatically add the vendor role
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for vendor signup
DROP TRIGGER IF EXISTS on_vendor_signup ON auth.users;

CREATE TRIGGER on_vendor_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_vendor_signup();