import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://ghwohwblgtryienupzkh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdod29od2JsZ3RyeWllbnVwemtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNzMxMTAsImV4cCI6MjA4OTc0OTExMH0.yioE8W9L0WGIiYTZ7F1c62bRj3yzJQO8obLD66APmlI'
)
