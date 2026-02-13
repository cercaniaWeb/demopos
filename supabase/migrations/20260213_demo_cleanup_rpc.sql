-- RPC for cleaning up demo data
CREATE OR REPLACE FUNCTION public.cleanup_demo_data(user_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Run with elevated privileges
AS $$
BEGIN
    -- Delete sale items first (cascaded by sale_id if configured, but let's be explicit)
    -- Actually, sale_items has ON DELETE CASCADE in 00_initial_schema.sql
    
    -- Delete sales processed by this user
    DELETE FROM public.sales WHERE processed_by = user_id_param;
    
    -- Delete transfers created by this user
    DELETE FROM public.transfers WHERE created_by = user_id_param;
    
    -- If there are other tables like expenses, delete them too
    -- DELETE FROM public.expenses WHERE created_by = user_id_param;
END;
$$;
