import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { menuData } from '../src/data/menuData.js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('Seeding menu items...');

  const { data, error } = await supabase
    .from('menu_items')
    .upsert(menuData.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      image: item.image,
      ingredients: item.ingredients,
      popular: item.popular,
      available: item.available,
      options: item.options
    })));

  if (error) {
    console.error('Error seeding data:', error);
  } else {
    console.log('Successfully seeded menu items!');
  }
}

seed();
