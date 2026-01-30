-- Supabase Schema for Work AI Platform CMS
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  avatar_image TEXT,
  avatar_color TEXT DEFAULT '#6161ff',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add is_active column if not exists (for existing databases)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'departments' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE departments ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  value TEXT,
  image TEXT,
  images TEXT[] DEFAULT '{}',
  use_cases TEXT[] DEFAULT '{}',
  replaces_tools JSONB DEFAULT '[]',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add images column if not exists (for existing databases)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'images'
  ) THEN
    ALTER TABLE products ADD COLUMN images TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  value TEXT,
  image TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vibe Apps table
CREATE TABLE IF NOT EXISTS vibe_apps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT,
  icon TEXT DEFAULT 'Sparkles',
  replaces_tools TEXT[] DEFAULT '{}',
  image TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sidekick Actions table
CREATE TABLE IF NOT EXISTS sidekick_actions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  value TEXT,
  image TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform Values table
CREATE TABLE IF NOT EXISTS platform_values (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  icon TEXT DEFAULT 'TrendingUp',
  title TEXT NOT NULL,
  description TEXT,
  supported_by TEXT[] DEFAULT '{}',
  replaces_tools TEXT[] DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Outcomes table (for navigation tabs)
CREATE TABLE IF NOT EXISTS outcomes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  avatar_image TEXT,
  avatar_color TEXT DEFAULT '#97aeff',
  maps_to_department TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pain Points table (for navigation tabs)
CREATE TABLE IF NOT EXISTS pain_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  avatar_image TEXT,
  avatar_color TEXT DEFAULT '#97aeff',
  maps_to_department TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  hero_title TEXT DEFAULT 'What would you like to achieve?',
  hero_subtitle TEXT DEFAULT 'Choose your department to see your tailored AI solution',
  tabs JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Transformations table (for navigation tabs)
CREATE TABLE IF NOT EXISTS ai_transformations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  avatar_image TEXT,
  avatar_color TEXT DEFAULT '#97aeff',
  maps_to_department TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
DO $$
BEGIN
  -- Drop existing triggers if they exist
  DROP TRIGGER IF EXISTS update_departments_updated_at ON departments;
  DROP TRIGGER IF EXISTS update_products_updated_at ON products;
  DROP TRIGGER IF EXISTS update_agents_updated_at ON agents;
  DROP TRIGGER IF EXISTS update_vibe_apps_updated_at ON vibe_apps;
  DROP TRIGGER IF EXISTS update_sidekick_actions_updated_at ON sidekick_actions;
  DROP TRIGGER IF EXISTS update_platform_values_updated_at ON platform_values;
  DROP TRIGGER IF EXISTS update_outcomes_updated_at ON outcomes;
  DROP TRIGGER IF EXISTS update_pain_points_updated_at ON pain_points;
  DROP TRIGGER IF EXISTS update_ai_transformations_updated_at ON ai_transformations;
  
  -- Create triggers
  CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_vibe_apps_updated_at BEFORE UPDATE ON vibe_apps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_sidekick_actions_updated_at BEFORE UPDATE ON sidekick_actions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_platform_values_updated_at BEFORE UPDATE ON platform_values FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_outcomes_updated_at BEFORE UPDATE ON outcomes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_pain_points_updated_at BEFORE UPDATE ON pain_points FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_ai_transformations_updated_at BEFORE UPDATE ON ai_transformations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
END $$;

-- Enable Row Level Security
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE vibe_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE sidekick_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_transformations ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (no auth required)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow all on departments" ON departments;
  DROP POLICY IF EXISTS "Allow all on products" ON products;
  DROP POLICY IF EXISTS "Allow all on agents" ON agents;
  DROP POLICY IF EXISTS "Allow all on vibe_apps" ON vibe_apps;
  DROP POLICY IF EXISTS "Allow all on sidekick_actions" ON sidekick_actions;
  DROP POLICY IF EXISTS "Allow all on platform_values" ON platform_values;
  DROP POLICY IF EXISTS "Allow all on outcomes" ON outcomes;
  DROP POLICY IF EXISTS "Allow all on pain_points" ON pain_points;
  DROP POLICY IF EXISTS "Allow all on ai_transformations" ON ai_transformations;
  
  CREATE POLICY "Allow all on departments" ON departments FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all on products" ON products FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all on agents" ON agents FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all on vibe_apps" ON vibe_apps FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all on sidekick_actions" ON sidekick_actions FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all on platform_values" ON platform_values FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all on outcomes" ON outcomes FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all on pain_points" ON pain_points FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all on ai_transformations" ON ai_transformations FOR ALL USING (true) WITH CHECK (true);
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_department ON products(department_id);
CREATE INDEX IF NOT EXISTS idx_agents_department ON agents(department_id);
CREATE INDEX IF NOT EXISTS idx_vibe_apps_department ON vibe_apps(department_id);
CREATE INDEX IF NOT EXISTS idx_sidekick_actions_department ON sidekick_actions(department_id);
CREATE INDEX IF NOT EXISTS idx_platform_values_department ON platform_values(department_id);

-- Insert initial departments
INSERT INTO departments (name, title, description, avatar_color, order_index) VALUES
  ('marketing', 'Marketing', 'Drive demand generation and accelerate campaign execution', '#97aeff', 1),
  ('sales', 'Sales', 'Close deals faster and increase win rates with AI-powered CRM', '#ffc875', 2),
  ('operations', 'Operations', 'Streamline operations and improve efficiency across teams', '#ff5ac4', 3),
  ('support', 'Customer Support', 'Deliver exceptional service with AI-powered ticket management', '#ff7575', 4),
  ('product', 'Product & Engineering', 'Ship features faster with AI-powered development workflows', '#a358d1', 5),
  ('legal', 'Legal', 'Ensure compliance and review contracts 5x faster with AI', '#5ac4a3', 6),
  ('finance', 'Finance', 'Close books faster with automated reconciliation and reporting', '#ff9a6c', 7),
  ('hr', 'Human Resources', 'Reduce time-to-hire and improve employee experience with AI', '#6fcfed', 8)
ON CONFLICT (name) DO NOTHING;

-- Insert sample outcomes
INSERT INTO outcomes (title, description, avatar_color, maps_to_department, order_index) VALUES
  ('Drive Demand Generation', 'Accelerate pipeline creation with AI-powered campaigns', '#97aeff', 'marketing', 0),
  ('Increase Win Rates', 'Close more deals with intelligent sales automation', '#ffc875', 'sales', 1),
  ('Improve Operational Efficiency', 'Streamline workflows and reduce manual tasks', '#ff5ac4', 'operations', 2),
  ('Enhance Customer Satisfaction', 'Deliver faster, more personalized support', '#ff7575', 'support', 3)
ON CONFLICT DO NOTHING;

-- Insert sample pain points
INSERT INTO pain_points (title, description, avatar_color, maps_to_department, order_index) VALUES
  ('Too Many Manual Tasks', 'Teams spend hours on repetitive work instead of strategic initiatives', '#97aeff', 'operations', 0),
  ('Slow Campaign Execution', 'Marketing campaigns take weeks instead of days to launch', '#ffc875', 'marketing', 1),
  ('Low Sales Productivity', 'Reps spend more time on admin than actual selling', '#ff5ac4', 'sales', 2),
  ('Slow Support Response', 'Customers wait too long for ticket resolution', '#ff7575', 'support', 3)
ON CONFLICT DO NOTHING;

-- Insert sample AI transformations
INSERT INTO ai_transformations (title, description, avatar_color, maps_to_department, order_index) VALUES
  ('AI-Powered Marketing', 'Generate content and campaigns 10x faster with AI agents', '#97aeff', 'marketing', 0),
  ('Intelligent Sales Automation', 'Let AI handle prospecting and follow-ups automatically', '#ffc875', 'sales', 1),
  ('Smart Operations', 'Automate workflows with AI-driven process optimization', '#ff5ac4', 'operations', 2),
  ('AI Customer Service', 'Resolve tickets instantly with AI-powered support', '#ff7575', 'support', 3)
ON CONFLICT DO NOTHING;

-- =====================================================
-- JUNCTION TABLES for Outcomes, Pain Points, AI Transformations
-- =====================================================

-- Junction tables for Outcomes
CREATE TABLE IF NOT EXISTS outcome_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  outcome_id UUID REFERENCES outcomes(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(outcome_id, product_id)
);

CREATE TABLE IF NOT EXISTS outcome_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  outcome_id UUID REFERENCES outcomes(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(outcome_id, agent_id)
);

CREATE TABLE IF NOT EXISTS outcome_vibe_apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  outcome_id UUID REFERENCES outcomes(id) ON DELETE CASCADE,
  vibe_app_id UUID REFERENCES vibe_apps(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(outcome_id, vibe_app_id)
);

CREATE TABLE IF NOT EXISTS outcome_sidekick_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  outcome_id UUID REFERENCES outcomes(id) ON DELETE CASCADE,
  sidekick_action_id UUID REFERENCES sidekick_actions(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(outcome_id, sidekick_action_id)
);

-- Junction tables for Pain Points
CREATE TABLE IF NOT EXISTS pain_point_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pain_point_id UUID REFERENCES pain_points(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(pain_point_id, product_id)
);

CREATE TABLE IF NOT EXISTS pain_point_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pain_point_id UUID REFERENCES pain_points(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(pain_point_id, agent_id)
);

CREATE TABLE IF NOT EXISTS pain_point_vibe_apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pain_point_id UUID REFERENCES pain_points(id) ON DELETE CASCADE,
  vibe_app_id UUID REFERENCES vibe_apps(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(pain_point_id, vibe_app_id)
);

CREATE TABLE IF NOT EXISTS pain_point_sidekick_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pain_point_id UUID REFERENCES pain_points(id) ON DELETE CASCADE,
  sidekick_action_id UUID REFERENCES sidekick_actions(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(pain_point_id, sidekick_action_id)
);

-- Junction tables for AI Transformations
CREATE TABLE IF NOT EXISTS ai_transformation_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ai_transformation_id UUID REFERENCES ai_transformations(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(ai_transformation_id, product_id)
);

CREATE TABLE IF NOT EXISTS ai_transformation_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ai_transformation_id UUID REFERENCES ai_transformations(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(ai_transformation_id, agent_id)
);

CREATE TABLE IF NOT EXISTS ai_transformation_vibe_apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ai_transformation_id UUID REFERENCES ai_transformations(id) ON DELETE CASCADE,
  vibe_app_id UUID REFERENCES vibe_apps(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(ai_transformation_id, vibe_app_id)
);

CREATE TABLE IF NOT EXISTS ai_transformation_sidekick_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ai_transformation_id UUID REFERENCES ai_transformations(id) ON DELETE CASCADE,
  sidekick_action_id UUID REFERENCES sidekick_actions(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(ai_transformation_id, sidekick_action_id)
);

-- Enable RLS on junction tables
ALTER TABLE outcome_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE outcome_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE outcome_vibe_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE outcome_sidekick_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_point_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_point_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_point_vibe_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_point_sidekick_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_transformation_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_transformation_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_transformation_vibe_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_transformation_sidekick_actions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for junction tables
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow all" ON outcome_products;
  DROP POLICY IF EXISTS "Allow all" ON outcome_agents;
  DROP POLICY IF EXISTS "Allow all" ON outcome_vibe_apps;
  DROP POLICY IF EXISTS "Allow all" ON outcome_sidekick_actions;
  DROP POLICY IF EXISTS "Allow all" ON pain_point_products;
  DROP POLICY IF EXISTS "Allow all" ON pain_point_agents;
  DROP POLICY IF EXISTS "Allow all" ON pain_point_vibe_apps;
  DROP POLICY IF EXISTS "Allow all" ON pain_point_sidekick_actions;
  DROP POLICY IF EXISTS "Allow all" ON ai_transformation_products;
  DROP POLICY IF EXISTS "Allow all" ON ai_transformation_agents;
  DROP POLICY IF EXISTS "Allow all" ON ai_transformation_vibe_apps;
  DROP POLICY IF EXISTS "Allow all" ON ai_transformation_sidekick_actions;
  
  CREATE POLICY "Allow all" ON outcome_products FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON outcome_agents FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON outcome_vibe_apps FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON outcome_sidekick_actions FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON pain_point_products FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON pain_point_agents FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON pain_point_vibe_apps FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON pain_point_sidekick_actions FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON ai_transformation_products FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON ai_transformation_agents FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON ai_transformation_vibe_apps FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON ai_transformation_sidekick_actions FOR ALL USING (true) WITH CHECK (true);
END $$;

-- =====================================================
-- JUNCTION TABLES for Departments (Many-to-Many)
-- Allows capabilities to be assigned to multiple departments
-- =====================================================

-- Department-Products junction table
CREATE TABLE IF NOT EXISTS department_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(department_id, product_id)
);

-- Department-Agents junction table
CREATE TABLE IF NOT EXISTS department_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(department_id, agent_id)
);

-- Department-Vibe Apps junction table
CREATE TABLE IF NOT EXISTS department_vibe_apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  vibe_app_id UUID REFERENCES vibe_apps(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(department_id, vibe_app_id)
);

-- Department-Sidekick Actions junction table
CREATE TABLE IF NOT EXISTS department_sidekick_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  sidekick_action_id UUID REFERENCES sidekick_actions(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(department_id, sidekick_action_id)
);

-- Enable RLS on department junction tables
ALTER TABLE department_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_vibe_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_sidekick_actions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for department junction tables
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow all" ON department_products;
  DROP POLICY IF EXISTS "Allow all" ON department_agents;
  DROP POLICY IF EXISTS "Allow all" ON department_vibe_apps;
  DROP POLICY IF EXISTS "Allow all" ON department_sidekick_actions;
  
  CREATE POLICY "Allow all" ON department_products FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON department_agents FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON department_vibe_apps FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON department_sidekick_actions FOR ALL USING (true) WITH CHECK (true);
END $$;

-- Create indexes for better performance on department junction tables
CREATE INDEX IF NOT EXISTS idx_department_products_dept ON department_products(department_id);
CREATE INDEX IF NOT EXISTS idx_department_products_product ON department_products(product_id);
CREATE INDEX IF NOT EXISTS idx_department_agents_dept ON department_agents(department_id);
CREATE INDEX IF NOT EXISTS idx_department_agents_agent ON department_agents(agent_id);
CREATE INDEX IF NOT EXISTS idx_department_vibe_apps_dept ON department_vibe_apps(department_id);
CREATE INDEX IF NOT EXISTS idx_department_vibe_apps_vibe ON department_vibe_apps(vibe_app_id);
CREATE INDEX IF NOT EXISTS idx_department_sidekick_dept ON department_sidekick_actions(department_id);
CREATE INDEX IF NOT EXISTS idx_department_sidekick_action ON department_sidekick_actions(sidekick_action_id);

-- =====================================================
-- MIGRATION: Copy existing department_id assignments to junction tables
-- Run this ONCE to migrate existing data
-- =====================================================

-- Migrate existing product assignments
INSERT INTO department_products (department_id, product_id)
SELECT department_id, id FROM products WHERE department_id IS NOT NULL
ON CONFLICT (department_id, product_id) DO NOTHING;

-- Migrate existing agent assignments
INSERT INTO department_agents (department_id, agent_id)
SELECT department_id, id FROM agents WHERE department_id IS NOT NULL
ON CONFLICT (department_id, agent_id) DO NOTHING;

-- Migrate existing vibe_apps assignments
INSERT INTO department_vibe_apps (department_id, vibe_app_id)
SELECT department_id, id FROM vibe_apps WHERE department_id IS NOT NULL
ON CONFLICT (department_id, vibe_app_id) DO NOTHING;

-- Migrate existing sidekick_actions assignments
INSERT INTO department_sidekick_actions (department_id, sidekick_action_id)
SELECT department_id, id FROM sidekick_actions WHERE department_id IS NOT NULL
ON CONFLICT (department_id, sidekick_action_id) DO NOTHING;
