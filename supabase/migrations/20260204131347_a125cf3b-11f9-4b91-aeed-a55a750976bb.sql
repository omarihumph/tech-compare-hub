-- Schedule the check-price-alerts function to run every hour
SELECT cron.schedule(
  'check-price-alerts-hourly',
  '0 * * * *',
  $$
  SELECT
    net.http_post(
        url:='https://hehmuleizhrxslgplptj.supabase.co/functions/v1/check-price-alerts',
        headers:=jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlaG11bGVpemhyeHNsZ3BscHRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODYzMjAsImV4cCI6MjA3ODk2MjMyMH0.pg0pkERAAnsBt5FzEFOjxaRcgDHH0LpT4TnWJ6K-N-o'
        ),
        body:='{}'::jsonb
    ) AS request_id;
  $$
);