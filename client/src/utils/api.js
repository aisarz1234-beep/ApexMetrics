const API_BASE = '/api';

export const api = {
  getToken() {
    return localStorage.getItem('apex_token');
  },
  setToken(token) {
    if (token) localStorage.setItem('apex_token', token);
    else localStorage.removeItem('apex_token');
  },

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    };

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  },

  // Auth
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setToken(data.token);
    return data;
  },

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    this.setToken(data.token);
    return data;
  },

  async getMe() {
    return this.request('/auth/me');
  },

  async updateProfile(updates) {
    return this.request('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  },

  async connectStrava() {
    return this.request('/auth/strava/connect', { method: 'POST' });
  },

  // Workouts
  async getWorkouts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/workouts?${query}`);
  },

  async logWorkout(payload) {
    return this.request('/workouts', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async toggleKudos(workoutId) {
    return this.request(`/workouts/${workoutId}/kudos`, { method: 'POST' });
  },

  async addComment(workoutId, text) {
    return this.request(`/workouts/${workoutId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  },

  async uploadGpx(fileOrText) {
    let body;
    let headers = {};

    if (typeof fileOrText === 'string') {
      body = JSON.stringify({ gpxText: fileOrText });
      headers['Content-Type'] = 'application/json';
    } else {
      const formData = new FormData();
      formData.append('gpxFile', fileOrText);
      body = formData;
      const token = this.getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/workouts/upload-gpx`, {
      method: 'POST',
      headers,
      body
    });
    return res.json();
  },

  // Leaderboards
  async getLeaderboard(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/leaderboards?${query}`);
  },

  // Raids
  async getRaids() {
    return this.request('/raids');
  },

  // Turf Wars
  async getTerritories() {
    return this.request('/turf-wars');
  },

  // Bounties
  async getBounties() {
    return this.request('/bounties');
  },

  async claimBounty(id) {
    return this.request(`/bounties/${id}/claim`, { method: 'POST' });
  },

  // Anti-Cheat
  async getAntiCheatFeed() {
    return this.request('/anticheat/feed');
  },

  async voteAntiCheat(workoutId, vote) {
    return this.request('/anticheat/vote', {
      method: 'POST',
      body: JSON.stringify({ workoutId, vote })
    });
  }
};
