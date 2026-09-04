import React, { useState } from 'react';
import {
  Users,
  Search,
  MapPin,
  Heart,
  Plus,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { toast } from 'sonner';

const mockRoommatePosts = [
  {
    id: 1,
    title: 'Looking for 1 Roommate in 2BHK Flat (Inavolu Road)',
    author: 'Maneesh C. (CSE 3rd Year)',
    roomType: 'Shared Room',
    vacancy: 1,
    rentShare: 4500,
    location: 'Inavolu Main Road (1.2 km from VIT-AP)',
    description: 'Spacious ventilated room with attached bathroom, Wi-Fi, and kitchen setup.',
    preferences: ['Non-smoker', 'Quiet Study', 'Early Riser'],
    status: 'Available',
  },
  {
    id: 2,
    title: 'Private Room Vacancy in 3BHK Gated Apartment',
    author: 'Priya Verma (ECE 4th Year)',
    roomType: 'Private Room',
    vacancy: 2,
    rentShare: 6500,
    location: 'Capital Heights, Amaravati (1.8 km)',
    description: 'Fully furnished private bedroom with AC, balcony, and power backup.',
    preferences: ['Vegetarian', 'Clean & Organized', 'Night Owl'],
    status: 'Available',
  },
  {
    id: 3,
    title: 'Flatmate Needed for 2BHK Deluxe Flat near North Gate',
    author: 'Rahul Sharma (CSE 2nd Year)',
    roomType: '2BHK Flatshare',
    vacancy: 1,
    rentShare: 5200,
    location: 'Near VIT-AP North Gate (0.9 km)',
    description: 'Looking for a chill flatmate to share rent and food expenses.',
    preferences: ['Non-smoker', 'Gamers Welcome'],
    status: 'Available',
  },
];

export default function Roommates() {
  const [posts, setPosts] = useState(mockRoommatePosts);
  const [search, setSearch] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('all');
  const [interestedIds, setInterestedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for creating post
  const [newTitle, setNewTitle] = useState('');
  const [newRoomType, setNewRoomType] = useState('Shared Room');
  const [newVacancy, setNewVacancy] = useState(1);
  const [newRent, setNewRent] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const toggleInterest = (id, author) => {
    if (interestedIds.includes(id)) {
      setInterestedIds(interestedIds.filter((item) => item !== id));
      toast.info('Cancelled interest request');
    } else {
      setInterestedIds([...interestedIds, id]);
      toast.success(`Interest request sent to ${author}! Waiting for seller acceptance.`);
    }
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle || !newRent || !newLocation || !newDesc) {
      toast.error('Please fill all required fields');
      return;
    }

    const created = {
      id: Date.now(),
      title: newTitle,
      author: 'Maneesh (You)',
      roomType: newRoomType,
      vacancy: Number(newVacancy),
      rentShare: Number(newRent),
      location: newLocation,
      description: newDesc,
      preferences: ['Verified Student'],
      status: 'Available',
    };

    setPosts([created, ...posts]);
    setIsModalOpen(false);
    toast.success('Roommate vacancy posted successfully!');

    // Reset
    setNewTitle('');
    setNewRent('');
    setNewLocation('');
    setNewDesc('');
  };

  const filtered = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedRoomType === 'all' || post.roomType === selectedRoomType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] mb-1">
            <Users className="w-4 h-4" />
            <span>Peer-to-Peer Roommate Finder</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] font-heading">
            Roommate Finder
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Find compatible flatmates and roommates for flats and PGs around VIT-AP campus.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        >
          Post Roommate Vacancy
        </Button>
      </div>

      {/* Filters */}
      <div className="sn-card p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-[var(--bg-card)]">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roommate listings by location or keywords..."
            className="sn-input pl-10 pr-4 py-2 w-full text-xs"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedRoomType}
            onChange={(e) => setSelectedRoomType(e.target.value)}
            className="sn-input px-3 py-2 w-full text-xs font-medium text-[var(--text-main)]"
          >
            <option value="all">All Room Types</option>
            <option value="Shared Room">Shared Room</option>
            <option value="Private Room">Private Room</option>
            <option value="2BHK Flatshare">2BHK Flatshare</option>
            <option value="3BHK Flatshare">3BHK Flatshare</option>
          </select>
        </div>
      </div>

      {/* Feed Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No roommate listings found"
          description="Be the first student to post a roommate vacancy!"
          actionLabel="Post Roommate Vacancy"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((post) => {
            const isInterested = interestedIds.includes(post.id);
            return (
              <Card key={post.id} hover className="p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#2563EB] text-[11px] font-bold">
                        {post.roomType}
                      </span>
                      {post.status && post.status !== 'Available' && (
                        <Badge variant="secondary" label={post.status} />
                      )}
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {post.vacancy} Vacancy
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[var(--text-main)] font-heading line-clamp-2">
                    {post.title}
                  </h3>

                  <div className="text-xs text-[#64748B] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{post.location}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {post.description}
                  </p>

                  {/* Preferences */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {post.preferences.map((pref, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-medium text-slate-600">
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-extrabold text-[#2563EB] font-heading">
                        ₹{post.rentShare.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ mo</span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> {post.author}
                      </div>
                    </div>

                    {post.status === 'Available' ? (
                      <Button
                        variant={isInterested ? 'secondary' : 'primary'}
                        size="sm"
                        onClick={() => toggleInterest(post.id, post.author)}
                      >
                        {isInterested ? 'Cancel Interest' : 'Interested'}
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" disabled>
                        {post.status}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[var(--bg-card)] rounded-2xl border border-[#E2E8F0] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[var(--text-main)] font-heading">
                Post Roommate Vacancy
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[var(--text-main)] block mb-1">Listing Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 1 Roommate needed for 2BHK near Gate 2"
                  className="sn-input w-full px-3 py-2 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--text-main)] block mb-1">Room Type</label>
                  <select
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value)}
                    className="sn-input w-full px-3 py-2 text-xs"
                  >
                    <option value="Shared Room">Shared Room</option>
                    <option value="Private Room">Private Room</option>
                    <option value="2BHK Flatshare">2BHK Flatshare</option>
                    <option value="3BHK Flatshare">3BHK Flatshare</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--text-main)] block mb-1">Vacancy Count</label>
                  <input
                    type="number"
                    min="1"
                    value={newVacancy}
                    onChange={(e) => setNewVacancy(e.target.value)}
                    className="sn-input w-full px-3 py-2 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--text-main)] block mb-1">Rent Share (₹/month)</label>
                  <input
                    type="number"
                    value={newRent}
                    onChange={(e) => setNewRent(e.target.value)}
                    placeholder="e.g. 4500"
                    className="sn-input w-full px-3 py-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--text-main)] block mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Inavolu Main Road"
                    className="sn-input w-full px-3 py-2 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-main)] block mb-1">Description</label>
                <textarea
                  rows="3"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe the room, amenities, and roommate habits..."
                  className="sn-input w-full px-3 py-2 text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Publish Vacancy
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
