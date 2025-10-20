export const ENV_VARIABLES: EnvVariable[] = [
  {
    name: "DATABASE_URL",
    description: "Supabase PostgreSQL database connection string for migrations and server-side operations",
    required: true,
    instructions: "Go to [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → Database → Connection string (URI format).\n Copy the full postgresql:// connection string.\n Make sure to replace [YOUR-PASSWORD] with actual password"
  },
  {
    name: "NEXT_PUBLIC_SUPABASE_URL",
    description: "Supabase project URL for client-side authentication and API calls",
    required: true,
    instructions: "Go to [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → Data API → Copy the 'Project URL -> URL' field (format: https://[project-id].supabase.co)"
  },
  {
    name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    description: "Supabase anonymous/publishable key for client-side authentication",
    required: true,
    instructions: "Go to [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → API Keys → Copy 'Legacy API keys → anon public' key"
  },
  {
    name: "JWT_SECRET",
    description: "Secret key for JWT token encryption (minimum 32 characters)",
    required: true,
    instructions: "Generate a secure random string with at least 32 characters. You can use: openssl rand -base64 32"
  },
  {
    name: "API_FOOTBALL_KEY",
    description: "API-Football API key for fetching live match data",
    required: false,
    instructions: "Sign up at https://www.api-football.com/ and copy your API key. Free tier includes 100 requests/day."
  }
];

export interface EnvVariable {
  name: string
  description: string
  instructions: string
  required: boolean
}

export function checkMissingEnvVars(): string[] {
  return ENV_VARIABLES.filter(envVar => envVar.required && !process.env[envVar.name]).map(envVar => envVar.name)
}