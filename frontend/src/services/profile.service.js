let profile = {
  id: 'u1',
  name: 'Dr. Priya Rao',
  email: 'priya@example.com',
  role: 'Healthcare Professional',
  language: 'en',
  interests: ['Cardiology', 'Pharmacology'],
  avatar: '/logo.png'
}

export function getProfile() {
  return Promise.resolve(profile)
}

export function updateProfile(patch) {
  profile = { ...profile, ...patch }
  return Promise.resolve(profile)
}

export default { getProfile, updateProfile }
