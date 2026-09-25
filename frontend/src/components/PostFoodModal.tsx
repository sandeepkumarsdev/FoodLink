import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Clock, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Image as ImageIcon, 
  Sparkles,
  Flame,
  Snowflake,
  Utensils
} from 'lucide-react';
import { User } from '../types';
import { PRESET_FOOD_IMAGES } from '../utils/helpers';

interface PostFoodModalProps {
  currentUser: User | null;
  onClose: () => void;
  onSubmit: (postData: any) => Promise<void>;
  isSubmitting: boolean;
}

export const PostFoodModal: React.FC<PostFoodModalProps> = ({
  currentUser,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [foodName, setFoodName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('20 portions');
  const [servingsCount, setServingsCount] = useState(20);
  const [location, setLocation] = useState(
    currentUser?.canteenName 
      ? `${currentUser.canteenName} Pickup Counter #1` 
      : 'Main Campus Dining Hall, Counter #2'
  );

  // Default deadline: 2.5 hours from now
  const defaultDeadline = new Date(Date.now() + 2.5 * 3600 * 1000).toISOString().slice(0, 16);
  const [collectionDeadline, setCollectionDeadline] = useState(defaultDeadline);

  const [imageUrl, setImageUrl] = useState(PRESET_FOOD_IMAGES[0].url);
  const [foodSafetyInfo, setFoodSafetyInfo] = useState(
    'Cooked fresh in commercial campus kitchen. Kept at hot holding temp >65°C. Safe to consume within 3 hours or refrigerate immediately.'
  );
  const [temperature, setTemperature] = useState<'HOT' | 'COLD' | 'ROOM_TEMP'>('HOT');
  const [dietaryTags, setDietaryTags] = useState<string[]>(['Vegetarian', 'Halal-Friendly']);
  const [error, setError] = useState<string | null>(null);

  const availableTags = [
    'Vegetarian',
    'Vegan',
    'Halal-Friendly',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
    'High-Protein',
  ];

  const handleToggleTag = (tag: string) => {
    if (dietaryTags.includes(tag)) {
      setDietaryTags(dietaryTags.filter((t) => t !== tag));
    } else {
      setDietaryTags([...dietaryTags, tag]);
    }
  };

  const setPresetDeadlineHours = (hours: number) => {
    const d = new Date(Date.now() + hours * 3600 * 1000);
    setCollectionDeadline(d.toISOString().slice(0, 16));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!foodName.trim()) {
      setError('Please provide the food name');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a short description');
      return;
    }
    if (!quantity.trim()) {
      setError('Please provide the quantity/portions');
      return;
    }
    if (!location.trim()) {
      setError('Please specify the exact pickup location');
      return;
    }

    try {
      await onSubmit({
        foodName,
        description,
        quantity,
        servingsCount,
        availableFrom: new Date().toISOString(),
        collectionDeadline: new Date(collectionDeadline).toISOString(),
        location,
        imageUrl,
        foodSafetyInfo,
        dietaryTags,
        temperature,
        userId: currentUser?.id,
        collegeName: currentUser?.college || 'Stanford Central Campus',
        canteenName: currentUser?.canteenName || 'Campus Main Canteen',
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to publish post');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Publish Surplus Food</h2>
              <p className="text-xs text-emerald-100">
                Notify registered campus students of available safe food
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[calc(85vh-160px)] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          {/* Food Name & Image preview */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Food Item Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 20 Portions of Lemon Rice with Lentil Tadka"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
            />
          </div>

          {/* Preset Photo Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Select High-Resolution Photo</span>
              <span className="text-[11px] font-normal text-slate-400">Click to choose image</span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-2">
              {PRESET_FOOD_IMAGES.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setImageUrl(preset.url);
                    if (!foodName) setFoodName(preset.name);
                    setDietaryTags(preset.tags);
                  }}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                    imageUrl === preset.url
                      ? 'border-emerald-600 ring-2 ring-emerald-500/40 scale-105'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={preset.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Custom URL Option */}
            <input
              type="url"
              placeholder="Or paste custom image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 text-slate-600"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Description & Packaging Details *
            </label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Freshly made for conference lunch, packed in sanitized containers with tamper seals..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-500 font-medium"
            />
          </div>

          {/* Quantity & Servings count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Quantity Label *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 20 portions / 15 meal boxes"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Portions Count (for Impact Stats)
              </label>
              <input
                type="number"
                min={1}
                value={servingsCount}
                onChange={(e) => setServingsCount(parseInt(e.target.value, 10) || 1)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* Collection Deadline */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Collection Deadline *
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPresetDeadlineHours(1.5)}
                  className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700"
                >
                  +1.5h
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDeadlineHours(3)}
                  className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700"
                >
                  +3h
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDeadlineHours(5)}
                  className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700"
                >
                  +5h
                </button>
              </div>
            </div>
            <input
              type="datetime-local"
              required
              value={collectionDeadline}
              onChange={(e) => setCollectionDeadline(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-500 font-medium cursor-pointer"
            />
          </div>

          {/* Collection Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Specific Collection Location / Counter *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tresidder Union 2nd Floor Dining Counter #3 (Ask for Chef Marco)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-500 font-medium"
            />
          </div>

          {/* Temperature & Dietary Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Food Holding Temperature
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setTemperature('HOT')}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-colors flex flex-col items-center gap-1 ${
                    temperature === 'HOT'
                      ? 'bg-orange-50 border-orange-400 text-orange-800'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>Hot</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTemperature('COLD')}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-colors flex flex-col items-center gap-1 ${
                    temperature === 'COLD'
                      ? 'bg-cyan-50 border-cyan-400 text-cyan-800'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Snowflake className="w-4 h-4 text-cyan-500" />
                  <span>Chilled</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTemperature('ROOM_TEMP')}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-colors flex flex-col items-center gap-1 ${
                    temperature === 'ROOM_TEMP'
                      ? 'bg-amber-50 border-amber-400 text-amber-800'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Utensils className="w-4 h-4 text-amber-500" />
                  <span>Ambient</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Dietary & Allergen Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleToggleTag(tag)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                      dietaryTags.includes(tag)
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Food Safety Advisory */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Food Safety & Hygiene Instructions *
            </label>
            <textarea
              required
              rows={2}
              value={foodSafetyInfo}
              onChange={(e) => setFoodSafetyInfo(e.target.value)}
              className="w-full text-xs px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-500 font-medium"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Publishing Post...' : 'Publish Surplus Post Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
